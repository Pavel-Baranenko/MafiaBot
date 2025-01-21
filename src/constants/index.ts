import { UserActions } from "@/types"

export const enemies: { [key: string]: string } = {
  "don": "comissar",
  "dragdiller": "doctor",
  "doctor": "dragdiller",
  "lawyer": "journalist",
  "prostitute": "gynecologist",
  "gynecologist": "prostitute",
  "gunseller": "sheriff",
  "sheriff": "gunseller",
  "maniac": "phychiatrist",
  "phychiatrist": "maniac",
}

export const times = [
  { value: "60", label: "1 мин" },
  { value: "120", label: "2 мин" },
  { value: "180", label: "3 мин" },
  { value: "30", label: "30 сек" },
  { value: "40", label: "40 сек" }
]

export let teamList: { [key: string]: string[] } = {
  'mafia': ["mafia", "don"],
  'don': ["mafia", "don"],
  'prostitute': ["mafia", "don", 'lawyer', "dragdiller", "gunseller", "prostitute"],
  'lawyer': ["lawyer", "mafia", "don", 'prostitute', "dragdiller", "gunseller"],
  'dragdiller': ["dragdiller", "gunseller", "prostitute", "lawyer"],
  'gunseller': ["gunseller", "dragdiller", "prostitute", "lawyer"]
}

export const stages: { [key: number]: string } = {
  0: "game start",
  10: "general discussion",
  11: "mafia introduction",
  1: "general discussion",
  2: "mafia wakes up",
  3: "all players make their moves",
  4: "night results, last words of killed players",
  5: "general discussion",
  6: "nominating",
  9: "general discussion",
  7: "voting",
  8: "voting results",
}


export let userActionsList: UserActions = {
  "mafia": "kill",
  "don": "kill",
  "lawyer": "protection",
  "prostitute": "bordel",
  "dragdiller": "drags",
  "gunseller": "wearon",
  "doctor": "heal",
  "comissar": "check",
  "journalist": "check",
  "gynecologist": "check",
  "phychiatrist": "check",
  "sheriff": "kill",
  "maniac": "kill",
  "citizen": "sleep",
  "traitor": "sleep"
}


export const InfoEnemies: { [key: string]: string } = {
  "don": "comissar",
  "comissar": "don",
  "dragdiller": "doctor",
  "doctor": "dragdiller",
  "lawyer": "journalist",
  "journalist": "lawyer",
  "prostitute": "gynecologist",
  "gynecologist": "prostitute",
  "gunseller": "sheriff",
  "sheriff": "gunseller",
  "maniac": "phychiatrist",
  "phychiatrist": "maniac",
}

export const InfoCard: { [key: string]: string } = {
  "don": "At night, you and Mafia players are the first to wake up together. You  silently decide who will be killed that night. You are also looking for a commissar after murder.",
  "comissar": "You can check any player sitting at the table for his membership in the mafia. Don’t forget that the maniac and traitor are shown as a light player.",
  "dragdiller": "You play for the dark team. You know the gunseller, prostitute and Lawyer of Mafia. The drugdealer is the doctor's personal enemy. You plant drugs every night in search of a doctor. If you hit a Doctor, he dies. The doctor kills you with his treatment if he guessed right.",
  "doctor": "You treat any player. You can treat the same person (including yourself) for no more than one night in a row.",
  "lawyer": "You play for the dark team. You know all the dark players. In fact, you are a 'Doctor' for Mafia players, including a prostitute, gunseller and drugdealer. You know all the dark players. Every night give immunity for dark players from daytime voting. If during the day they voted for a player who has immunity from a Lawyer, then the bot announces that this player has been saved by a lawyer and remains to play. You don’t save player from the actions of a maniac.",
  "journalist": "You can check any two players sitting at the table for their belonging to one or two teams. You cannot compare other players with yourself. Don’t forget that the maniac and traitor are shown as a light player.",
  "prostitute": "You play for the dark team. You know all the dark players. You send any player to the bordel  every night. You can send them to a bordel every other night. You can help dark players by hiding them in a bordel, or kill light ones. The second time (every other time) in a bordel kills the player. If you find a Gynecologist, he dies immediately.",
  "gynecologist": "You are looking for a prostitute every night. If you find her, she dies.",
  "gunseller": "You play for the dark team. You know the drugdealer, prostitute and Lawyer of Mafia. The gunseller is the sheriff's personal enemy. If you find a Sheriff, he dies. ",
  "sheriff": " You can shoot at anyone you see fit, but only from the 3rd night. ",
  "maniac": "You are playing for yourself. You can kill someone every night. It can be a mafia player or a civilian ",
  "phychiatrist": "You are looking for a maniac every night. If you find  him -  the maniac dies.",
  "mafia": "At night, you and Mafia Don are the first to wake up together. You  silently decide who will be killed that night",
  "citizen": "Try to understand who the mafia is here and win the dark players together with other peaceful ones ",
  "traitor": "You play for the light team until the mafia players are killed. After there is no mafia left, you become a 'Mafia'. You don’t not kill on the night of betrayal. You play for yourself.  "
}