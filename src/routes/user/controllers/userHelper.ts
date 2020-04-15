export class Helper {
  getRemainingDays(user) {
    let remain;
    const currentDate = new Date().getTime();
    const userDate = new Date(user.expireDate).getTime();
    remain = userDate - currentDate;
    remain > 0 ? (remain = remain / (1000 * 3600 * 24)) : (remain = 0);
    remain = Math.ceil(remain);
    return remain;
  }
}
