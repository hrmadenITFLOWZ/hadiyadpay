'use client';

import type {
  CardLanguage,
  CardOption,
} from '../../lib/card-types';

import type {
  EditorDraft,
} from '../../lib/card-editor';

import useDialogAccessibility from '../hooks/useDialogAccessibility';
import CardArtworkLayer from './CardArtworkLayer';
import OpenCardPreview from './OpenCardPreview';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  selectedOccasion: CardOption;
  draft: EditorDraft;
  cardPrice: number;
  initialLanguage: CardLanguage;
  isSubmitting: boolean;
  error: string | null;
  onPay: () => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  onEdit,
  selectedOccasion,
  draft,
  cardPrice,
  initialLanguage,
  isSubmitting,
  error,
  onPay,
}: CheckoutModalProps) {
  const dialogRef =
    useDialogAccessibility<HTMLElement>(
      isOpen,
      onClose,
    );

  if (!isOpen) {
    return null;
  }

  const lang =
    initialLanguage;

  const inside =
    draft.inside;

  const content = {
    so: {
      eyebrow:
        'Hadiyaddaada',

      title:
        'Hubi Hadiyaddaada',

      description:
        'Hal mar oo ugu dambeysa eeg Hadiyaddaada ka hor intaadan sii wadin.',

      cover:
        'Dibadda',

      inside:
        'Gudaha',

      digital:
        'Hadiyad dijitaal ah',

      total:
        'Wadarta',

      edit:
        'Wax ka beddel',

      pay:
        'Dhammaystir dalabka',

      waiting:
        'Dalabka diyaarinaya…',

      close:
        'Xir',

      secure:
        'Lacag-bixin ammaan ah',
    },

    en: {
      eyebrow:
        'Your Hadiyad',

      title:
        'Review your Hadiyad',

      description:
        'Take one last look before sending your Hadiyad.',

      cover:
        'Cover',

      inside:
        'Inside',

      digital:
        'Digital Hadiyad',

      total:
        'Total',

      edit:
        'Make a change',

      pay:
        'Complete purchase',

      waiting:
        'Preparing checkout…',

      close:
        'Close',

      secure:
        'Secure checkout',
    },

    nl: {
      eyebrow:
        'Jouw Hadiyad',

      title:
        'Controleer je Hadiyad',

      description:
        'Bekijk je Hadiyad nog één keer voordat je verdergaat.',

      cover:
        'Voorkant',

      inside:
        'Binnenkant',

      digital:
        'Digitale Hadiyad',

      total:
        'Totaal',

      edit:
        'Nog iets aanpassen',

      pay:
        'Bestelling afronden',

      waiting:
        'Afrekenen voorbereiden…',

      close:
        'Sluiten',

      secure:
        'Veilig afrekenen',
    },
  }[
    lang
  ];

  const formattedPrice =
    new Intl.NumberFormat(
      lang === 'nl'
        ? 'nl-NL'
        : lang === 'so'
          ? 'so-SO'
          : 'en-IE',
      {
        style:
          'currency',

        currency:
          'EUR',
      },
    ).format(
      cardPrice,
    );

  const coverAspectRatio =
    selectedOccasion.orientation ===
    'portrait'
      ? '2 / 3'
      : '4 / 3';

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-sm sm:items-center sm:p-5">
      <section
        ref={
          dialogRef
        }
        tabIndex={
          -1
        }
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        aria-describedby="checkout-description"
        className="relative my-3 max-h-[calc(100dvh-1.5rem)] w-full max-w-[980px] overflow-y-auto rounded-[28px] border border-stone-200 bg-[#fffdf9] shadow-2xl sm:my-5 sm:max-h-[calc(100dvh-2.5rem)]"
      >
        <button
          type="button"
          onClick={
            onClose
          }
          disabled={
            isSubmitting
          }
          aria-label={
            content.close
          }
          className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-[#285347] bg-white text-base text-[#285347] transition hover:bg-[#eef4f1] disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347] sm:right-7 sm:top-7"
        >
          ×
        </button>

        <div className="px-5 pb-7 pt-6 sm:px-8 sm:pb-8 sm:pt-7">
          <header className="mx-auto max-w-2xl pr-12 text-center sm:pr-0">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9a7146]">
              {
                content.eyebrow
              }
            </p>

            <h2
              id="checkout-title"
              className="mt-1.5 font-serif text-3xl leading-tight text-[#173f35] sm:text-[2.2rem]"
            >
              {
                content.title
              }
            </h2>

            <p
              id="checkout-description"
              className="mx-auto mt-1.5 max-w-lg text-sm leading-6 text-stone-500"
            >
              {
                content.description
              }
            </p>
          </header>

          <main className="mx-auto mt-7 max-w-[800px]">
            <div className="grid items-center justify-center gap-8 md:grid-cols-[290px_450px]">
              <section
                aria-label={
                  content.cover
                }
                className="mx-auto flex w-full max-w-[290px] items-center justify-center"
              >
                <div
                  className="relative w-full overflow-hidden rounded-[20px] border border-[#ded7cc] bg-[#f7f1e8] shadow-[0_12px_30px_rgba(75,57,35,0.14)]"
                  style={{
                    aspectRatio:
                      coverAspectRatio,
                  }}
                >
                  <CardArtworkLayer
                    artwork={
                      selectedOccasion.artwork
                    }
                    language={
                      lang
                    }
                    decorative={
                      false
                    }
                    overlay={
                      false
                    }
                    fit="contain"
                    backgroundColor="#f7f1e8"
                  />
                </div>
              </section>

              <section
                aria-label={
                  content.inside
                }
                className="mx-auto w-full max-w-[450px]"
              >
                <div className="relative h-[330px] w-full overflow-visible">
                  <div
                    className="absolute left-1/2 top-1/2 w-[620px]"
                    style={{
                      transform:
                        'translate(-50%, -50%) scale(0.72)',

                      transformOrigin:
                        'center center',
                    }}
                  >
                    <OpenCardPreview
                      card={
                        selectedOccasion
                      }
                      language={
                        lang
                      }
                      inside={
                        inside
                      }
                      isOpen={
                        true
                      }
                      interactive={
                        false
                      }
                      showEditGuides={
                        false
                      }
                    />
                  </div>
                </div>
              </section>
            </div>

            <div className="mx-auto mt-6 max-w-[750px] border-t border-stone-200 pt-5">
              <div className="flex items-end justify-between gap-5">
                <div className="min-w-0">
                  <p className="font-serif text-lg leading-tight text-[#173f35] sm:text-xl">
                    {
                      selectedOccasion.title[
                        lang
                      ]
                    }
                  </p>

                  <p className="mt-1 text-xs text-stone-400">
                    {
                      content.digital
                    }
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-stone-400">
                    {
                      content.total
                    }
                  </p>

                  <p className="mt-0.5 text-2xl font-black tracking-tight text-[#173f35]">
                    {
                      formattedPrice
                    }
                  </p>
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="mt-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm leading-5 text-rose-800"
                >
                  {
                    error
                  }
                </p>
              )}

              <div className="mt-5 grid gap-3 sm:grid-cols-[190px_minmax(0,1fr)]">
                <button
                  type="button"
                  onClick={
                    onEdit
                  }
                  disabled={
                    isSubmitting
                  }
                  className="min-h-12 rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold text-stone-700 transition hover:border-stone-400 hover:bg-stone-50 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
                >
                  {
                    content.edit
                  }
                </button>

                <button
                  type="button"
                  onClick={
                    onPay
                  }
                  disabled={
                    isSubmitting
                  }
                  className="min-h-12 rounded-xl bg-[#285347] px-5 text-sm font-bold text-white shadow-[0_7px_18px_rgba(40,83,71,0.18)] transition hover:-translate-y-0.5 hover:bg-[#1e4338] hover:shadow-[0_9px_22px_rgba(40,83,71,0.22)] disabled:cursor-wait disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
                >
                  {isSubmitting ? (
                    content.waiting
                  ) : (
                    <span className="flex w-full items-center justify-between gap-4">
                      <span className="font-bold">
                        {
                          content.pay
                        }
                      </span>

                      <span className="flex shrink-0 items-center gap-3 border-l border-white/20 pl-4">
                        <span className="font-bold">
                          {
                            formattedPrice
                          }
                        </span>

                        <span
                          aria-hidden="true"
                          className="text-base"
                        >
                          →
                        </span>
                      </span>
                    </span>
                  )}
                </button>
              </div>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-medium text-stone-400">
                <span
                  aria-hidden="true"
                >
                  🔒
                </span>

                <span>
                  {
                    content.secure
                  }
                </span>
              </div>
            </div>
          </main>
        </div>
      </section>
    </div>
  );
}