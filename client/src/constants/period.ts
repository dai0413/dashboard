type Period = {
  key: string;
  label: string;
  startDate: string;
  endDate: string;
};

export const fullNationalPeriods: Period[] = [
  {
    key: "jpn-ger",
    label: "2002-2006",
    startDate: "2002/5/1",
    endDate: "2006/7/1",
  },
  {
    key: "ger-zaf",
    label: "2006-2010",
    startDate: "2006/5/1",
    endDate: "2010/7/1",
  },
  {
    key: "zaf-bra",
    label: "2010-2014",
    startDate: "2010/5/1",
    endDate: "2014/7/1",
  },
  {
    key: "bra-rus",
    label: "2014-2018",
    startDate: "2014/5/1",
    endDate: "2018/8/1",
  },
  {
    key: "rus-qat",
    label: "2018-2022",
    startDate: "2018/5/1",
    endDate: "2022/12/31",
  },
  {
    key: "qat-usa",
    label: "2022-2026",
    startDate: "2022/11/1",
    endDate: "2026/07/30",
  },
  {
    key: "usa-spa",
    label: "2026-2030",
    startDate: "2026/6/1",
    endDate: "2030/8/30",
  },
];
