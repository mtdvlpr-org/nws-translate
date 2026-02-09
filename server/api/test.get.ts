export default defineEventHandler(async () => {
  console.log("get test");

  const _number = 5 / 0;
  return {
    message: "Hello World",
  };
});
