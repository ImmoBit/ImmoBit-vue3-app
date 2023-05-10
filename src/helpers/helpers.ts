export const formatPrice = (str: string) => {
  const st1: string | number = str.toString().replace(/\s+/g, "");
  const st2: string | number = new Number(st1).toLocaleString("fr-Fr");
  return st2 == '0' ? '' : st2;
};


export async function urlsToFiles(urls: string[]) {
  const files = []
  for (const url of urls) {
    try {
      const response = await fetch(url);
      const data = await response.blob();
      const metadata = {
        type: 'image/jpeg',
      };
      const file = new File([data], 'image.jpg', metadata);
      files.push(file)
    } catch {
      return null
    }
  }
  return files
}

export function filesToBase64(files: File[]) {
  const imgsSrc: string[] = [];
  for (const file of files) {
    const reader = new FileReader();
    reader.onload = event => {
      imgsSrc.push((event.target as any).result)
    };
    reader.readAsDataURL(file);
  }
  return imgsSrc
}