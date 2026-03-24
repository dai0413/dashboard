import { Scraped } from "@dai0413/myorg-shared/types/sn_m/position";

type Result = {
  ok: boolean;
  data: Scraped;
  error?: string;
};

const homeSample = [
  {
    number: 21,
    player_name: "パクチョンヒョ",
    position: "GK",
  },
  {
    number: 24,
    player_name: "パクホヨン",
    position: "CB",
  },
  {
    number: 11,
    player_name: "コヨンジュン",
    position: "LCF",
  },
  {
    number: 13,
    player_name: "イギヒョク",
    position: "LCB",
  },
  {
    number: 42,
    player_name: "モジェヒョン",
    position: "RIH",
  },
  {
    number: 4,
    player_name: "ソミヌ",
    position: "DM",
  },
  {
    number: 28,
    player_name: "イスンウォン",
    position: "LIH",
  },
  {
    number: 34,
    player_name: "ソンジュンソク",
    position: "RWB",
  },
  {
    number: 47,
    player_name: "シンミンハ",
    position: "RCB",
  },
  {
    number: 99,
    player_name: "カンジュンヒョク",
    position: "LWB",
  },
  {
    number: 19,
    player_name: "パクサンヒョク",
    position: "RCF",
  },
];

const awaySample = [
  {
    number: 3,
    player_name: "昌子 源",
    position: "RCB",
  },
  {
    number: 19,
    player_name: "中山 雄太",
    position: "LCB",
  },
  {
    number: 18,
    player_name: "下田 北斗",
    position: "LCM",
  },
  {
    number: 16,
    player_name: "前 寛之",
    position: "RCM",
  },
  {
    number: 50,
    player_name: "岡村 大八",
    position: "CB",
  },
  {
    number: 1,
    player_name: "谷 晃生",
    position: "GK",
  },
  {
    number: 7,
    player_name: "相馬 勇紀",
    position: "LIH",
  },
  {
    number: 10,
    player_name: "ナ サンホ",
    position: "RIH",
  },
  {
    number: 88,
    player_name: "中村 帆高",
    position: "LWB",
  },
  {
    number: 6,
    player_name: "望月 ヘンリー海輝",
    position: "RWB",
  },
  {
    number: 99,
    player_name: "イェンギ",
    position: "CF",
  },
];

export const result: Result = {
  ok: true,
  data: {
    home: homeSample,
    away: awaySample,
  },
};
