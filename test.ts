const convertNumberToEmoji = (n: number) => {
  const s = n.toString();
  let r = "";
  const emojis = "０1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣";
  for (let i = 0; i < s.length; i++) {
    r += emojis[parseInt(s[i])];
    console.log(parseInt(s[i]));
    console.log(r);
  }
  console.log(s, r);
  return r;
};

convertNumberToEmoji(40);
