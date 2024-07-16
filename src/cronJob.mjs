// cronJob.mjs
import cron from "node-cron";
import fetch from "node-fetch";

const fetchData = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/keep-db-active");
    const data = await res.json();
    console.log("Fetched data:", data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Schedule the task to run every day at midnight
cron.schedule('0 0 * * *', fetchData);

console.log('Cron job started: Fetching data every day at midnight');

export default function startCronJob() {
  cron.schedule('0 0 * * *', fetchData);
}
