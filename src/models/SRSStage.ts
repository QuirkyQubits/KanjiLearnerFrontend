export const SRSStage = {
  LOCKED: "LOCKED",
  LESSON: "LESSON",
  APPRENTICE_1: "APPRENTICE_1",
  APPRENTICE_2: "APPRENTICE_2",
  APPRENTICE_3: "APPRENTICE_3",
  APPRENTICE_4: "APPRENTICE_4",
  GURU_1: "GURU_1",
  GURU_2: "GURU_2",
  MASTER: "MASTER",
  ENLIGHTENED: "ENLIGHTENED",
  BURNED: "BURNED",
} as const;

export type SRSStage = typeof SRSStage[keyof typeof SRSStage];

export const srsStageDisplayMap: Record<SRSStage, string> = {
  LOCKED: "Locked",
  LESSON: "Lesson",
  APPRENTICE_1: "Apprentice 1",
  APPRENTICE_2: "Apprentice 2",
  APPRENTICE_3: "Apprentice 3",
  APPRENTICE_4: "Apprentice 4",
  GURU_1: "Guru 1",
  GURU_2: "Guru 2",
  MASTER: "Master",
  ENLIGHTENED: "Enlightened",
  BURNED: "Burned",
};