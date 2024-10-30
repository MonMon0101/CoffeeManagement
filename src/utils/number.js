export const formatPrice = (price = 0) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

export const formatTime = (time) => {
  const d = new Date(time);
  const formatDate =
    [d.getMonth() + 1, d.getDate(), d.getFullYear()].join("/") +
    " " +
    [d.getHours(), d.getMinutes(), d.getSeconds()].join(":");

  return formatDate;
};
