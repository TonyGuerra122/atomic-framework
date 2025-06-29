// scripts/copy-template.js
const fs = require("fs-extra");
const path = require("path");

const src = path.resolve(__dirname, "../template");
const dest = path.resolve(__dirname, "../dist/template");

fs.copy(src, dest)
  .then(() => {
    console.log("📁 Template copiado com sucesso!");
  })
  .catch((err) => {
    console.error("❌ Erro ao copiar o template:", err);
    process.exit(1);
  });
