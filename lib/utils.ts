import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 郵便番号から住所取得
export async function getAddressByZipCode(zipCode: string) {
  const apiUrl = `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipCode}`;

  try {
    const response = await fetch(apiUrl),
      data = await response.json();

    if (data.status === 200 && data.results) {
      const address = data.results[0];

      return `${address.address1}${address.address2}${address.address3}`;
    } else {
      return "";
    }
  } catch (error) {
    return "";
  }
}
