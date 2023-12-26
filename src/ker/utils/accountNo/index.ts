// utils
import { ApiTimer } from "../timer";

export const generateAccountNo = () => {
    const unixTime = new ApiTimer().getDate().toString();
    const accountNo = parseInt(unixTime.slice(-10));
    const publicAccountNo = parseInt(unixTime.slice(1, 10));

    return { accountNo, publicAccountNo }
}