export async function getAddressFromZipCode(zipCode: string) {
  try {
    if (zipCode.length !== 7) return null;
    const response = await fetch(
      `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipCode}`
    );
    const data = await response.json();

    if (data.status !== 200 || !data.results) {
      return null;
    }

    const result = data.results[0];
    return {
      prefecture: result.address1,
      city: result.address2,
      town: result.address3,
    };
  } catch {
    return null;
  }
}
