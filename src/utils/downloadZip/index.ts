import { saveAs } from 'file-saver';
import JSZip from 'jszip';

interface IFiles {
  name: string;
  content: string;
}

export const downloadZip = async (zipName: string, files: IFiles[]) => {
  const zip = new JSZip();
  const folder = zip.folder(zipName);

  if (folder) {
    files.forEach((file) => {
      folder.file(file.name, file.content);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${zipName}.zip`);
  }
};
