'use client';

import {
  useEffect,
  useReducer,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';

import type {
  CardLanguage,
  CardOption,
} from '../../lib/card-types';

import {
  createEditorRuntimeState,
  createStickerInstance,
  editorColorOptions,
  editorReducer,
  loadDraftFromStorage,
  saveDraftToStorage,
  type EditorAction,
  type EditorPhotoFrameSize,
  type EditorPhotoLayer,
  type EditorPreviewMode,
  type EditorStickerChanges,
  type EditorTextLayer,
} from '../../lib/card-editor';

import {
  serializeEditorDraft,
} from '../../lib/card-order';

import {
  getCardComposition,
} from '../../lib/card-composition';

import type {
  StickerAsset,
} from '../data/stickers';

import CheckoutModal from './CheckoutModal';
import OpenCardPreview from './OpenCardPreview';
import useDialogAccessibility from '../hooks/useDialogAccessibility';
import TextControls from './editor/TextControls';
import PhotoControls from './editor/PhotoControls';
import StickerControls from './editor/StickerControls';
import HistoryControls from './editor/HistoryControls';
import PreviewControls from './editor/PreviewControls';
import ResetControls from './editor/ResetControls';
import EditorStatus from './editor/EditorStatus';

interface CardBuilderProps {
  card: CardOption;
  currentLanguage: CardLanguage;
  onClose: () => void;
}

type SelectedEditorLayer =
  | 'photo'
  | 'text'
  | 'sticker';

const MAX_IMAGE_SIZE_BYTES =
  8 * 1024 * 1024;

const MAX_ORDER_PHOTO_BYTES =
  1800 * 1024;

const SUPPORTED_IMAGE_TYPES =
  new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
  ]);

function revokeOwnedPhotoUrl(
  url: string,
  ownedUrls: Set<string>,
  files: Map<string, File>,
) {
  if (
    ownedUrls.delete(
      url,
    )
  ) {
    URL.revokeObjectURL(
      url,
    );

    files.delete(
      url,
    );
  }
}

async function compressPhotoForOrder(
  file: File,
): Promise<File> {
  const image =
    await createImageBitmap(
      file,
    );

  const longestSide =
    Math.max(
      image.width,
      image.height,
    );

  let scale =
    Math.min(
      1,
      1800 /
        longestSide,
    );

  let blob:
    Blob | null =
    null;

  for (
    let attempt = 0;
    attempt < 5;
    attempt += 1
  ) {
    const canvas =
      document.createElement(
        'canvas',
      );

    canvas.width =
      Math.max(
        1,
        Math.round(
          image.width *
            scale,
        ),
      );

    canvas.height =
      Math.max(
        1,
        Math.round(
          image.height *
            scale,
        ),
      );

    const context =
      canvas.getContext(
        '2d',
      );

    if (
      !context
    ) {
      image.close();

      throw new Error(
        'Photo could not be prepared for checkout',
      );
    }

    context.fillStyle =
      '#ffffff';

    context.fillRect(
      0,
      0,
      canvas.width,
      canvas.height,
    );

    context.drawImage(
      image,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    blob =
      await new Promise<
        Blob | null
      >(
        (
          resolve,
        ) => {
          canvas.toBlob(
            resolve,
            'image/jpeg',
            0.86 -
              attempt *
                0.08,
          );
        },
      );

    if (
      blob &&
      blob.size <=
        MAX_ORDER_PHOTO_BYTES
    ) {
      break;
    }

    scale *=
      0.82;
  }

  image.close();

  if (
    !blob ||
    blob.size >
      MAX_ORDER_PHOTO_BYTES
  ) {
    throw new Error(
      'Photo could not be reduced to the secure upload limit',
    );
  }

  return new File(
    [
      blob,
    ],
    'card-photo.jpg',
    {
      type:
        'image/jpeg',
    },
  );
}

export default function CardBuilder({
  card,
  currentLanguage,
  onClose,
}: CardBuilderProps) {
  const initialState =
    () => {
      const savedDraft =
        loadDraftFromStorage(
          card,
          currentLanguage,
        );

      if (
        savedDraft
      ) {
        const normalizedDraft = {
          ...savedDraft,

          side:
            'inside' as const,

          previewMode:
            savedDraft.previewMode ===
            'full'
              ? 'clean' as const
              : savedDraft.previewMode,
        };

        return {
          draft:
            normalizedDraft,

          history: [
            normalizedDraft,
          ],

          historyIndex:
            0,
        };
      }

      const runtime =
        createEditorRuntimeState(
          card,
          currentLanguage,
        );

      const normalizedDraft = {
        ...runtime.draft,

        side:
          'inside' as const,

        previewMode:
          runtime.draft.previewMode ===
          'full'
            ? 'clean' as const
            : runtime.draft.previewMode,
      };

      return {
        ...runtime,

        draft:
          normalizedDraft,

        history: [
          normalizedDraft,
        ],

        historyIndex:
          0,
      };
    };

  const [
    editorState,
    dispatch,
  ] =
    useReducer(
      editorReducer,
      {
        card,
        currentLanguage,
      },
      initialState,
    );

  const [
    isCardOpen,
    setIsCardOpen,
  ] =
    useState(
      false,
    );

  const [
    activeTextLayer,
    setActiveTextLayer,
  ] =
    useState<EditorTextLayer>(
      'message',
    );

  const [
    selectedLayer,
    setSelectedLayer,
  ] =
    useState<SelectedEditorLayer>(
      'text',
    );

  const [
    selectedStickerId,
    setSelectedStickerId,
  ] =
    useState<string | null>(
      null,
    );

  const [
    isCheckoutOpen,
    setIsCheckoutOpen,
  ] =
    useState(
      false,
    );

  const [
    isCheckoutSubmitting,
    setIsCheckoutSubmitting,
  ] =
    useState(
      false,
    );

  const [
    checkoutError,
    setCheckoutError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    hasUnsavedChanges,
    setHasUnsavedChanges,
  ] =
    useState(
      false,
    );

  const ownedPhotoUrlsRef =
    useRef(
      new Set<string>(),
    );

  const photoFilesRef =
    useRef(
      new Map<
        string,
        File
      >(),
    );

  const photoInputRef =
    useRef<HTMLInputElement>(
      null,
    );

  const checkoutSubmittingRef =
    useRef(
      false,
    );

  const isMountedRef =
    useRef(
      false,
    );

  const dialogRef =
    useDialogAccessibility<HTMLDivElement>(
      !isCheckoutOpen,
      onClose,
    );

  const draft =
    editorState.draft;

  const activeSideData =
    draft.inside;

  const currentTextStyle =
    activeSideData.textStyles[
      activeTextLayer
    ];

  const commitAction = (
    action: EditorAction,
  ) => {
    dispatch(
      action,
    );

    setHasUnsavedChanges(
      true,
    );
  };

  const text = {
    so: {
      close:
        'Xir personalisation-ka',

      invalidImage:
        'Dooro sawir JPEG, PNG ama WebP oo aan ka weynayn 8 MB.',

      imageError:
        'Sawirkan lama furi karin.',

      undo:
        'Dib u noqo',

      redo:
        'Mar kale samee',

      resetCard:
        'Dib uga bilow Hadiyaddan',

      resetSide:
        'Gudaha dib u hagaaji',

      resetConfirm:
        'Ma hubtaa inaad Hadiyaddan dib uga bilaabayso?',

      editing:
        'Shakhsiyee',

      preview:
        'Eeg natiijada',

      full:
        'Muuqaal buuxa',

      photoSize:
        'Qaabka',

      small:
        'Yar',

      medium:
        'Dhexdhexaad',

      large:
        'Weyn',

      resetTransform:
        'Sawirka soo celi',

      reselectPhoto:
        'Fadlan sawirkaaga mar kale dooro.',

      adjustPhoto:
        'Sawirkaaga',

      remove:
        'Ka saar',

      changePhoto:
        'Dooro sawir kale',

      dragPhoto:
        'Sawirka ku jiid kaarka si aad u muujiso qaybta ugu quruxda badan.',

      closedPreview:
        'Hadiyaddaada',

      openPreview:
        'Gudaha Hadiyaddaada',

      closedTitle:
        'Ka dhig Hadiyaddan mid adiga kuu gaar ah',

      openTitle:
        'Samee Hadiyad xusuus reebta',

      closedDescription:
        'Fur Hadiyadda oo ku dar fariintaada, sawirkaaga iyo taabashadaada gaarka ah.',

      openDescription:
        'Ku dar ereyo, sawir iyo faahfaahin si gaar ah loogu sameeyey qofka helaya.',

      openCard:
        'Bilow shakhsiyeeynta',

      giftSection:
        'Ka dhig mid ka sii gaar ah',

      giftTitle:
        'Ku dar hadiyad',

      giftDescription:
        'Dhawaan waxaad Hadiyadda ku dari kartaa daabacaad, jir ama xusuus gaar ah.',

      comingSoon:
        'Dhawaan',

      moreOptions:
        'Wax badan ka beddel',

      continue:
        'Eeg Hadiyaddayda',
    },

    en: {
      close:
        'Close personalisation',

      invalidImage:
        'Choose a JPEG, PNG or WebP image no larger than 8 MB.',

      imageError:
        'We could not open this image.',

      undo:
        'Undo',

      redo:
        'Redo',

      resetCard:
        'Start this Hadiyad again',

      resetSide:
        'Restore the inside',

      resetConfirm:
        'Are you sure you want to start this Hadiyad again?',

      editing:
        'Personalise',

      preview:
        'See the result',

      full:
        'Full view',

      photoSize:
        'Format',

      small:
        'Small',

      medium:
        'Medium',

      large:
        'Large',

      resetTransform:
        'Restore photo',

      reselectPhoto:
        'Please choose your photo again.',

      adjustPhoto:
        'Your photo',

      remove:
        'Remove',

      changePhoto:
        'Choose another photo',

      dragPhoto:
        'Drag your photo across the card to show its best part.',

      closedPreview:
        'Your Hadiyad',

      openPreview:
        'Inside your Hadiyad',

      closedTitle:
        'Make this Hadiyad truly yours',

      openTitle:
        'Create a Hadiyad they will remember',

      closedDescription:
        'Open your Hadiyad and add your words, photo and personal finishing touches.',

      openDescription:
        'Add meaningful words, a favourite photo and details chosen especially for them.',

      openCard:
        'Start personalising',

      giftSection:
        'Make it even more special',

      giftTitle:
        'Add a gift',

      giftDescription:
        'Soon you can pair your Hadiyad with a print, frame or meaningful keepsake.',

      comingSoon:
        'Coming soon',

      moreOptions:
        'More ways to personalise',

      continue:
        'Review my Hadiyad',
    },

    nl: {
      close:
        'Personaliseren sluiten',

      invalidImage:
        'Kies een JPEG-, PNG- of WebP-afbeelding van maximaal 8 MB.',

      imageError:
        'We konden deze afbeelding niet openen.',

      undo:
        'Ongedaan maken',

      redo:
        'Opnieuw',

      resetCard:
        'Opnieuw beginnen',

      resetSide:
        'Binnenkant herstellen',

      resetConfirm:
        'Weet je zeker dat je opnieuw wilt beginnen met deze Hadiyad?',

      editing:
        'Personaliseren',

      preview:
        'Bekijk het resultaat',

      full:
        'Volledige weergave',

      photoSize:
        'Formaat',

      small:
        'Klein',

      medium:
        'Middel',

      large:
        'Groot',

      resetTransform:
        'Herstel foto',

      reselectPhoto:
        'Kies je foto opnieuw om verder te gaan.',

      adjustPhoto:
        'Jouw foto',

      remove:
        'Verwijder',

      changePhoto:
        'Kies een andere foto',

      dragPhoto:
        'Sleep je foto over de kaart om precies het mooiste deel te laten zien.',

      closedPreview:
        'Jouw Hadiyad',

      openPreview:
        'Binnenin jouw Hadiyad',

      closedTitle:
        'Maak deze Hadiyad helemaal van jou',

      openTitle:
        'Maak een Hadiyad om te bewaren',

      closedDescription:
        'Open je Hadiyad en voeg jouw woorden, foto en persoonlijke details toe.',

      openDescription:
        'Voeg een mooie boodschap, favoriete foto en details toe die speciaal voor de ontvanger zijn gekozen.',

      openCard:
        'Begin met personaliseren',

      giftSection:
        'Maak het nog bijzonderder',

      giftTitle:
        'Voeg een cadeau toe',

      giftDescription:
        'Binnenkort combineer je jouw Hadiyad met een print, lijst of bijzonder aandenken.',

      comingSoon:
        'Binnenkort',

      moreOptions:
        'Meer mogelijkheden',

      continue:
        'Bekijk mijn Hadiyad',
    },
  }[
    currentLanguage
  ];

  useEffect(
    () => {
      if (
        draft.side !==
        'inside'
      ) {
        dispatch({
          type:
            'SET_SIDE',

          side:
            'inside',
        });

        return;
      }

      if (
        draft.previewMode ===
        'full'
      ) {
        dispatch({
          type:
            'SET_PREVIEW_MODE',

          mode:
            'clean',
        });
      }
    },
    [
      draft.side,
      draft.previewMode,
    ],
  );

  useEffect(
    () => {
      const timer =
        window.setTimeout(
          () => {
            saveDraftToStorage(
              card,
              draft,
            );

            setHasUnsavedChanges(
              false,
            );
          },
          250,
        );

      return () =>
        window.clearTimeout(
          timer,
        );
    },
    [
      card,
      draft,
    ],
  );

  useEffect(
    () => {
      if (
        selectedStickerId &&
        !activeSideData.stickers.some(
          (
            sticker,
          ) =>
            sticker.id ===
            selectedStickerId,
        )
      ) {
        setSelectedStickerId(
          null,
        );

        if (
          selectedLayer ===
          'sticker'
        ) {
          setSelectedLayer(
            'text',
          );
        }
      }
    },
    [
      activeSideData.stickers,
      selectedLayer,
      selectedStickerId,
    ],
  );

  useEffect(
    () => {
      const referencedUrls =
        new Set<string>();

      for (
        const snapshot of [
          editorState.draft,
          ...editorState.history,
        ]
      ) {
        const sources = [
          snapshot.front.photo
            ?.src,

          snapshot.inside.photo
            ?.src,
        ];

        for (
          const source of
          sources
        ) {
          if (
            source?.startsWith(
              'blob:',
            )
          ) {
            referencedUrls.add(
              source,
            );
          }
        }
      }

      for (
        const url of
        ownedPhotoUrlsRef.current
      ) {
        if (
          !referencedUrls.has(
            url,
          )
        ) {
          revokeOwnedPhotoUrl(
            url,
            ownedPhotoUrlsRef.current,
            photoFilesRef.current,
          );
        }
      }
    },
    [
      editorState,
    ],
  );

  useEffect(
    () => {
      isMountedRef.current =
        true;

      const ownedPhotoUrls =
        ownedPhotoUrlsRef.current;

      const photoFiles =
        photoFilesRef.current;

      return () => {
        isMountedRef.current =
          false;

        for (
          const url of
          ownedPhotoUrls
        ) {
          revokeOwnedPhotoUrl(
            url,
            ownedPhotoUrls,
            photoFiles,
          );
        }
      };
    },
    [],
  );

  useEffect(
    () => {
      if (
        !hasUnsavedChanges
      ) {
        return;
      }

      const handleBeforeUnload = (
        event:
          BeforeUnloadEvent,
      ) => {
        event.preventDefault();

        event.returnValue =
          '';
      };

      window.addEventListener(
        'beforeunload',
        handleBeforeUnload,
      );

      return () =>
        window.removeEventListener(
          'beforeunload',
          handleBeforeUnload,
        );
    },
    [
      hasUnsavedChanges,
    ],
  );

  const handleImageUpload = (
    event:
      ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[
        0
      ];

    if (
      !file
    ) {
      return;
    }

    if (
      !SUPPORTED_IMAGE_TYPES.has(
        file.type,
      ) ||
      file.size >
        MAX_IMAGE_SIZE_BYTES
    ) {
      window.alert(
        text.invalidImage,
      );

      event.target.value =
        '';

      return;
    }

    const nextUrl =
      URL.createObjectURL(
        file,
      );

    ownedPhotoUrlsRef.current.add(
      nextUrl,
    );

    photoFilesRef.current.set(
      nextUrl,
      file,
    );

    const previewImage =
      new window.Image();

    previewImage.onerror =
      () => {
        revokeOwnedPhotoUrl(
          nextUrl,
          ownedPhotoUrlsRef.current,
          photoFilesRef.current,
        );

        window.alert(
          text.imageError,
        );
      };

    previewImage.onload =
      () => {
        if (
          !isMountedRef.current
        ) {
          revokeOwnedPhotoUrl(
            nextUrl,
            ownedPhotoUrlsRef.current,
            photoFilesRef.current,
          );

          return;
        }

        const photo:
          EditorPhotoLayer = {
          src:
            nextUrl,

          width:
            previewImage.naturalWidth,

          height:
            previewImage.naturalHeight,

          scale:
            1,

          x:
            50,

          y:
            50,

          rotation:
            0,

          frameSize:
            'large',

          requiresReselection:
            false,
        };

        setSelectedLayer(
          'photo',
        );

        setSelectedStickerId(
          null,
        );

        commitAction({
          type:
            'UPLOAD_PHOTO',

          photo,
        });
      };

    previewImage.src =
      nextUrl;

    event.target.value =
      '';
  };

  const handleFrameSizeChange = (
    frameSize:
      EditorPhotoFrameSize,
  ) => {
    if (
      !activeSideData.photo
    ) {
      return;
    }

    commitAction({
      type:
        'ADJUST_PHOTO',

      changes: {
        frameSize,
      },
    });
  };

  const handleMoveText = (
    direction:
      'up' | 'down',
  ) => {
    const currentPosition =
      activeSideData.textPositions[
        activeTextLayer
      ];

    const movement =
      direction ===
      'up'
        ? -3
        : 3;

    commitAction({
      type:
        'SET_TEXT_POSITION',

      layer:
        activeTextLayer,

      position: {
        x:
          currentPosition.x,

        y:
          Math.min(
            92,
            Math.max(
              8,
              currentPosition.y +
                movement,
            ),
          ),
      },
    });
  };

  const handleResetTextPosition =
    () => {
      const composition =
        getCardComposition(
          card,
          'inside',
        );

      const defaultPosition =
        composition
          .defaultTextPositions[
          activeTextLayer
        ];

      commitAction({
        type:
          'SET_TEXT_POSITION',

        layer:
          activeTextLayer,

        position: {
          x:
            defaultPosition.x,

          y:
            defaultPosition.y,
        },
      });
    };

  const handleAddSticker = (
    asset:
      StickerAsset,
  ) => {
    const sticker =
      createStickerInstance(
        {
          id:
            asset.id,

          src:
            asset.src,

          label:
            asset.label[
              currentLanguage
            ],

          defaultWidth:
            asset.defaultWidth,

          defaultScale:
            asset.defaultScale,

          defaultRotation:
            asset.defaultRotation,
        },
        activeSideData.stickers,
      );

    commitAction({
      type:
        'ADD_STICKER',

      sticker,
    });

    setSelectedLayer(
      'sticker',
    );

    setSelectedStickerId(
      sticker.id,
    );
  };

  const handleSelectSticker = (
    stickerId:
      string,
  ) => {
    setSelectedLayer(
      'sticker',
    );

    setSelectedStickerId(
      stickerId,
    );
  };

  const handleStickerChange = (
    stickerId: string,
    changes:
      EditorStickerChanges,
    recordHistory:
      boolean,
  ) => {
    dispatch({
      type:
        'UPDATE_STICKER',

      stickerId,

      changes,

      recordHistory:
        false,
    });

    setSelectedLayer(
      'sticker',
    );

    setSelectedStickerId(
      stickerId,
    );

    setHasUnsavedChanges(
      true,
    );

    if (
      recordHistory
    ) {
      dispatch({
        type:
          'COMMIT_DRAFT',
      });
    }
  };

  const handleRemoveSticker = (
    stickerId:
      string,
  ) => {
    commitAction({
      type:
        'REMOVE_STICKER',

      stickerId,
    });

    setSelectedStickerId(
      null,
    );

    setSelectedLayer(
      'text',
    );
  };

  const handleDuplicateSticker = (
    stickerId:
      string,
  ) => {
    const randomPart =
      typeof crypto !==
        'undefined' &&
      typeof crypto.randomUUID ===
        'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`;

    const newStickerId =
      `sticker-${randomPart}`;

    commitAction({
      type:
        'DUPLICATE_STICKER',

      stickerId,

      newStickerId,
    });

    setSelectedLayer(
      'sticker',
    );

    setSelectedStickerId(
      newStickerId,
    );
  };

  const handleResetCard =
    () => {
      if (
        !window.confirm(
          text.resetConfirm,
        )
      ) {
        return;
      }

      commitAction({
        type:
          'RESET_CARD',

        card,

        currentLanguage,
      });

      setSelectedLayer(
        'text',
      );

      setSelectedStickerId(
        null,
      );

      setIsCardOpen(
        false,
      );
    };

  const handleCheckout =
    async () => {
      if (
        checkoutSubmittingRef.current
      ) {
        return;
      }

      checkoutSubmittingRef.current =
        true;

      setCheckoutError(
        null,
      );

      setIsCheckoutSubmitting(
        true,
      );

      try {
        const formData =
          new FormData();

        formData.set(
          'cardId',
          card.id,
        );

        formData.set(
          'language',
          currentLanguage,
        );

        formData.set(
          'draft',
          JSON.stringify(
            serializeEditorDraft({
              ...draft,

              side:
                'inside',

              previewMode:
                draft.previewMode ===
                'full'
                  ? 'clean'
                  : draft.previewMode,
            }),
          ),
        );

        const photo =
          draft.inside.photo;

        if (
          photo
        ) {
          if (
            photo.requiresReselection ||
            !photo.src
          ) {
            throw new Error(
              text.reselectPhoto,
            );
          }

          const sourceFile =
            photoFilesRef.current.get(
              photo.src,
            );

          if (
            !sourceFile
          ) {
            throw new Error(
              text.reselectPhoto,
            );
          }

          formData.set(
            'photoInside',
            await compressPhotoForOrder(
              sourceFile,
            ),
          );
        }

        const response =
          await fetch(
            '/api/orders',
            {
              method:
                'POST',

              body:
                formData,
            },
          );

        const result:
          unknown =
          await response
            .json()
            .catch(
              () =>
                null,
            );

        if (
          !response.ok ||
          !result ||
          typeof result !==
            'object' ||
          !(
            'checkoutUrl' in
            result
          ) ||
          typeof result.checkoutUrl !==
            'string'
        ) {
          const message =
            result &&
            typeof result ===
              'object' &&
            'error' in
              result &&
            typeof result.error ===
              'string'
              ? result.error
              : 'Checkout could not be started. Please try again later.';

          throw new Error(
            message,
          );
        }

        const checkoutUrl =
          new URL(
            result.checkoutUrl,
          );

        const isStripeCheckout =
          checkoutUrl.protocol ===
            'https:' &&
          checkoutUrl.hostname ===
            'checkout.stripe.com' &&
          !checkoutUrl.username &&
          !checkoutUrl.password;

        const isDevelopmentOrder =
          process.env.NODE_ENV ===
            'development' &&
          checkoutUrl.origin ===
            window.location.origin;

        if (
          !isStripeCheckout &&
          !isDevelopmentOrder
        ) {
          throw new Error(
            'The secure checkout URL was not valid',
          );
        }

        window.location.assign(
          checkoutUrl.toString(),
        );
      } catch (
        error
      ) {
        checkoutSubmittingRef.current =
          false;

        setCheckoutError(
          error instanceof
            Error
            ? error.message
            : 'Checkout could not be started. Please try again later.',
        );

        setIsCheckoutSubmitting(
          false,
        );
      }
    };

  const handleOpenCard =
    () => {
      setIsCardOpen(
        true,
      );

      if (
        draft.side !==
        'inside'
      ) {
        commitAction({
          type:
            'SET_SIDE',

          side:
            'inside',
        });
      }
    };

  const renderPreviewCard =
    () => (
      <OpenCardPreview
        card={
          card
        }
        language={
          currentLanguage
        }
        inside={
          draft.inside
        }
        isOpen={
          isCardOpen
        }
        interactive={
          isCardOpen &&
          draft.previewMode ===
            'edit'
        }
        showEditGuides={
          isCardOpen &&
          draft.previewMode ===
            'edit'
        }
        activeTextLayer={
          activeTextLayer
        }
        selectedLayer={
          selectedLayer
        }
        selectedStickerId={
          selectedStickerId
        }
        onOpen={
          handleOpenCard
        }
        onClose={() =>
          setIsCardOpen(
            false,
          )
        }
        onRequestPhoto={() =>
          photoInputRef.current
            ?.click()
        }
        onTextSelect={(
          layer,
        ) => {
          setActiveTextLayer(
            layer,
          );

          setSelectedLayer(
            'text',
          );

          setSelectedStickerId(
            null,
          );
        }}
        onTextPositionChange={(
          layer,
          position,
          recordHistory,
        ) => {
          dispatch({
            type:
              'SET_TEXT_POSITION',

            layer,

            position,

            recordHistory:
              false,
          });

          setHasUnsavedChanges(
            true,
          );

          if (
            recordHistory
          ) {
            dispatch({
              type:
                'COMMIT_DRAFT',
            });
          }
        }}
        onPhotoSelect={() => {
          setSelectedLayer(
            'photo',
          );

          setSelectedStickerId(
            null,
          );
        }}
        onPhotoPositionChange={(
          position,
          recordHistory,
        ) => {
          dispatch({
            type:
              'ADJUST_PHOTO',

            changes:
              position,

            recordHistory:
              false,
          });

          setHasUnsavedChanges(
            true,
          );

          if (
            recordHistory
          ) {
            dispatch({
              type:
                'COMMIT_DRAFT',
            });
          }
        }}
        onStickerSelect={
          handleSelectSticker
        }
        onStickerChange={
          handleStickerChange
        }
        onStickerRemove={
          handleRemoveSticker
        }
      />
    );

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-sm sm:items-center sm:p-4">
        <div
          ref={
            dialogRef
          }
          tabIndex={
            -1
          }
          role="dialog"
          aria-modal={
            !isCheckoutOpen
          }
          aria-hidden={
            isCheckoutOpen
          }
          aria-labelledby="card-editor-heading"
          className="relative my-3 flex max-h-[calc(100vh-1.5rem)] w-full max-w-7xl flex-col gap-7 overflow-y-auto rounded-3xl border border-stone-200 bg-white p-5 shadow-2xl sm:my-6 sm:max-h-[calc(100vh-3rem)] sm:p-7 lg:flex-row"
        >
          <button
            type="button"
            onClick={
              onClose
            }
            disabled={
              isCheckoutSubmitting
            }
            aria-label={
              text.close
            }
            className="absolute right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-stone-100 text-stone-800 transition hover:bg-stone-200 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
          >
            ×
          </button>

          <section
            aria-label={
              currentLanguage ===
              'nl'
                ? 'Voorbeeld van je Hadiyad'
                : currentLanguage ===
                    'so'
                  ? 'Muuqaalka Hadiyadda'
                  : 'Your Hadiyad preview'
            }
            className="flex w-full flex-col gap-4 self-start lg:sticky lg:top-4 lg:w-[58%]"
          >
            <div className="flex min-h-8 items-center justify-between gap-3 pr-12">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-stone-700">
                {
                  isCardOpen
                    ? text.openPreview
                    : text.closedPreview
                }
              </span>

              <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-amber-900">
                {
                  card.badge[
                    currentLanguage
                  ]
                }
              </span>
            </div>

            <div>
              {
                renderPreviewCard()
              }
            </div>
          </section>

          <section className="flex w-full flex-col justify-between gap-6 lg:w-[42%]">
            <div className="flex flex-col gap-5">
              <div className="pr-10">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a7257]">
                  HadiyadPay
                </p>

                <h2
                  id="card-editor-heading"
                  className="mt-2 font-serif text-3xl leading-tight text-[#263e36]"
                >
                  {
                    isCardOpen
                      ? text.openTitle
                      : text.closedTitle
                  }
                </h2>

                <p className="mt-3 max-w-md text-sm leading-6 text-stone-600">
                  {
                    isCardOpen
                      ? text.openDescription
                      : text.closedDescription
                  }
                </p>
              </div>

              {!isCardOpen && (
                <button
                  type="button"
                  onClick={
                    handleOpenCard
                  }
                  className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#285347] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#1e4338] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
                >
                  {
                    text.openCard
                  }

                  <span aria-hidden="true">
                    →
                  </span>
                </button>
              )}

              {isCardOpen && (
                <>
                  <PreviewControls
                    activeMode={
                      draft.previewMode
                    }
                    onSelect={(
                      mode:
                        EditorPreviewMode,
                    ) =>
                      commitAction({
                        type:
                          'SET_PREVIEW_MODE',

                        mode,
                      })
                    }
                    labels={{
                      edit:
                        text.editing,

                      clean:
                        text.preview,

                      full:
                        text.full,
                    }}
                  />

                  <TextControls
                    currentLanguage={
                      currentLanguage
                    }
                    activeLayer={
                      activeTextLayer
                    }
                    value={
                      activeSideData[
                        activeTextLayer
                      ]
                    }
                    style={
                      currentTextStyle
                    }
                    onLayerSelect={(
                      layer,
                    ) => {
                      setActiveTextLayer(
                        layer,
                      );

                      setSelectedLayer(
                        'text',
                      );

                      setSelectedStickerId(
                        null,
                      );
                    }}
                    onValueChange={(
                      value,
                    ) =>
                      commitAction({
                        type:
                          'SET_FIELD',

                        field:
                          activeTextLayer,

                        value,
                      })
                    }
                    onColorSelect={(
                      color,
                    ) =>
                      commitAction({
                        type:
                          'SET_TEXT_STYLE',

                        layer:
                          activeTextLayer,

                        style: {
                          color,
                        },
                      })
                    }
                    onAlignSelect={(
                      align,
                    ) =>
                      commitAction({
                        type:
                          'SET_TEXT_STYLE',

                        layer:
                          activeTextLayer,

                        style: {
                          align,
                        },
                      })
                    }
                    onSizeChange={(
                      size,
                    ) =>
                      commitAction({
                        type:
                          'SET_TEXT_STYLE',

                        layer:
                          activeTextLayer,

                        style: {
                          size,
                        },
                      })
                    }
                    onFontFamilyChange={(
                      family,
                    ) =>
                      commitAction({
                        type:
                          'SET_TEXT_FORMAT',

                        layer:
                          activeTextLayer,

                        field:
                          'family',

                        value:
                          family,
                      })
                    }
                    onToggleStyle={(
                      field,
                    ) =>
                      commitAction({
                        type:
                          'SET_TEXT_FORMAT',

                        layer:
                          activeTextLayer,

                        field,

                        value:
                          !currentTextStyle[
                            field
                          ],
                      })
                    }
                    onMoveUp={() =>
                      handleMoveText(
                        'up',
                      )
                    }
                    onMoveDown={() =>
                      handleMoveText(
                        'down',
                      )
                    }
                    onResetPosition={
                      handleResetTextPosition
                    }
                    onResetStyle={() =>
                      commitAction({
                        type:
                          'RESET_TEXT_STYLE',

                        layer:
                          activeTextLayer,
                      })
                    }
                    colorOptions={
                      editorColorOptions
                    }
                  />

                  <PhotoControls
                    hasPhoto={Boolean(
                      activeSideData.photo &&
                      !activeSideData.photo
                        .requiresReselection,
                    )}
                    inputRef={
                      photoInputRef
                    }
                    onUpload={
                      handleImageUpload
                    }
                    onRemove={() =>
                      commitAction({
                        type:
                          'REMOVE_PHOTO',
                      })
                    }
                    onFrameSizeChange={
                      handleFrameSizeChange
                    }
                    frameSize={
                      activeSideData.photo
                        ?.frameSize ??
                      'large'
                    }
                    onResetTransform={() =>
                      commitAction({
                        type:
                          'RESET_PHOTO_TRANSFORM',

                        position: {
                          x:
                            50,

                          y:
                            50,
                        },
                      })
                    }
                    labels={{
                      photo:
                        text.changePhoto,

                      remove:
                        text.remove,

                      adjust:
                        text.adjustPhoto,

                      size:
                        text.photoSize,

                      small:
                        text.small,

                      medium:
                        text.medium,

                      large:
                        text.large,

                      reset:
                        text.resetTransform,

                      drag:
                        text.dragPhoto,
                    }}
                  />

                  <StickerControls
                    language={
                      currentLanguage
                    }
                    stickers={
                      activeSideData.stickers
                    }
                    selectedStickerId={
                      selectedStickerId
                    }
                    onAddSticker={
                      handleAddSticker
                    }
                    onSelectSticker={
                      handleSelectSticker
                    }
                    onScaleChange={(
                      stickerId,
                      scale,
                    ) =>
                      commitAction({
                        type:
                          'UPDATE_STICKER',

                        stickerId,

                        changes: {
                          scale,
                        },
                      })
                    }
                    onRotationChange={(
                      stickerId,
                      rotation,
                    ) =>
                      commitAction({
                        type:
                          'UPDATE_STICKER',

                        stickerId,

                        changes: {
                          rotation,
                        },
                      })
                    }
                    onBringForward={(
                      stickerId,
                    ) =>
                      commitAction({
                        type:
                          'BRING_STICKER_FORWARD',

                        stickerId,
                      })
                    }
                    onSendBackward={(
                      stickerId,
                    ) =>
                      commitAction({
                        type:
                          'SEND_STICKER_BACKWARD',

                        stickerId,
                      })
                    }
                    onBringToFront={(
                      stickerId,
                    ) =>
                      commitAction({
                        type:
                          'BRING_STICKER_TO_FRONT',

                        stickerId,
                      })
                    }
                    onSendToBack={(
                      stickerId,
                    ) =>
                      commitAction({
                        type:
                          'SEND_STICKER_TO_BACK',

                        stickerId,
                      })
                    }
                    onDuplicate={
                      handleDuplicateSticker
                    }
                    onRemove={
                      handleRemoveSticker
                    }
                  />

                  <section
                    aria-label={
                      text.giftSection
                    }
                    className="rounded-2xl border border-[#dfd3c1] bg-gradient-to-br from-[#fffaf1] to-[#f7efe2] p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        aria-hidden="true"
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-xl shadow-sm"
                      >
                        🎁
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-bold text-[#3d352d]">
                              {
                                text.giftTitle
                              }
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-[#75695d]">
                              {
                                text.giftDescription
                              }
                            </p>
                          </div>

                          <span className="rounded-full border border-[#d9c5a5] bg-white/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#806442]">
                            {
                              text.comingSoon
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>
                </>
              )}
            </div>

            {isCardOpen && (
              <div className="space-y-4">
                <details className="rounded-2xl border border-stone-200 bg-white">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-xs font-semibold text-stone-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]">
                    <span>
                      {
                        text.moreOptions
                      }
                    </span>

                    <span
                      aria-hidden="true"
                      className="text-stone-400"
                    >
                      ↓
                    </span>
                  </summary>

                  <div className="space-y-3 border-t border-stone-100 p-3">
                    <HistoryControls
                      canUndo={
                        editorState.historyIndex >
                        0
                      }
                      canRedo={
                        editorState.historyIndex <
                        editorState.history.length -
                          1
                      }
                      onUndo={() =>
                        dispatch({
                          type:
                            'UNDO',
                        })
                      }
                      onRedo={() =>
                        dispatch({
                          type:
                            'REDO',
                        })
                      }
                      labels={{
                        undo:
                          text.undo,

                        redo:
                          text.redo,
                      }}
                    />

                    <ResetControls
                      onResetActiveSide={() => {
                        commitAction({
                          type:
                            'RESET_ACTIVE_SIDE',

                          card,

                          currentLanguage,
                        });

                        setSelectedLayer(
                          'text',
                        );

                        setSelectedStickerId(
                          null,
                        );
                      }}
                      onResetCard={
                        handleResetCard
                      }
                      labels={{
                        activeSide:
                          text.resetSide,

                        card:
                          text.resetCard,
                      }}
                    />
                  </div>
                </details>

                <button
                  type="button"
                  onClick={() => {
                    setCheckoutError(
                      null,
                    );

                    setSelectedStickerId(
                      null,
                    );

                    setIsCheckoutOpen(
                      true,
                    );
                  }}
                  className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#285347] px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#1e4338] hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
                >
                  {
                    text.continue
                  }

                  <span aria-hidden="true">
                    →
                  </span>
                </button>

                <EditorStatus
                  currentLanguage={
                    currentLanguage
                  }
                  shareNotice={
                    null
                  }
                  photoRequiresReselection={Boolean(
                    activeSideData.photo
                      ?.requiresReselection,
                  )}
                />
              </div>
            )}
          </section>
        </div>
      </div>

      <CheckoutModal
        isOpen={
          isCheckoutOpen
        }
        onClose={() =>
          setIsCheckoutOpen(
            false,
          )
        }
        onEdit={() =>
          setIsCheckoutOpen(
            false,
          )
        }
        selectedOccasion={
          card
        }
        draft={{
          ...draft,

          side:
            'inside',

          previewMode:
            draft.previewMode ===
            'full'
              ? 'clean'
              : draft.previewMode,
        }}
        cardPrice={
          2
        }
        initialLanguage={
          currentLanguage
        }
        isSubmitting={
          isCheckoutSubmitting
        }
        error={
          checkoutError
        }
        onPay={
          handleCheckout
        }
      />
    </>
  );
}