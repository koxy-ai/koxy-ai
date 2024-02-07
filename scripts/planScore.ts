const plans = {
  free: 0,
  pro: 1,
  team: 2,
};

export default function planScore(plan: string) {
  switch (plan) {
    case "free":
      return 0;

    case "pro":
      return 1;

    case "team":
      return 2;
  }
}
