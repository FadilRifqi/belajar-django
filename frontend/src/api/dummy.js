export const barData = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      label: "Revenue",
      data: [12000, 19000, 3000, 5000, 2000, 3000],
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1,
    },
  ],
};

export const barOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Monthly Revenue",
    },
  },
};

export const radarData = {
  labels: ["North", "South", "East", "West", "Central"],
  datasets: [
    {
      label: "Sales by Region",
      data: [65, 59, 90, 81, 56],
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1,
    },
  ],
};

export const radarOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Sales by Region",
    },
  },
};

export const pieData = {
  labels: ["Web", "Mobile", "Desktop"],
  datasets: [
    {
      label: "Sales by Platform",
      data: [300, 50, 100],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

export const pieOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Sales by Platform",
    },
  },
};

export const statsCards = [
  {
    title: "Total Sales",
    value: "$32,499.93",
    change: "+12.95% Compared to last month",
    bgColor: "bg-green-100",
    textColor: "text-green-600",
  },
  {
    title: "Total Orders",
    value: "32,499",
    change: "+20.1% Compared to last month",
    bgColor: "bg-blue-100",
    textColor: "text-blue-600",
  },
  {
    title: "Visitors",
    value: "32,499",
    change: "-12.95% Compared to last month",
    bgColor: "bg-red-100",
    textColor: "text-red-600",
  },
  {
    title: "Refunded",
    value: "2,499",
    change: "+13% Compared to last month",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-600",
  },
];

export const topProducts = [
  { name: "Home Decor", percentage: "90%", color: "bg-purple-500" },
  {
    name: "Disney Princess Pink Bag",
    percentage: "70%",
    color: "bg-green-500",
  },
  { name: "Wall Clock", percentage: "45%", color: "bg-red-500" },
  { name: "Lamp", percentage: "36%", color: "bg-orange-500" },
];
