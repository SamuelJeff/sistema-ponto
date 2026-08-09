function formatarDataRecife(data) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Recife",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(data));
}

module.exports = {
  formatarDataRecife,
};