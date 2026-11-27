export type EditorStagePosition =
  "front" | "inside-left" | "inside-right" | "back";

export const editorStageOrder: EditorStagePosition[] = [
  "front",
  "inside-left",
  "inside-right",
  "back",
];

export function isInsideStage(position: EditorStagePosition): boolean {
  return position === "inside-left" || position === "inside-right";
}
