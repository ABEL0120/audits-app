import { useState } from 'react';

export type UserPhoto = {
  filepath: string;
  webviewPath?: string;
};

export function usePhotoGallery() {
  const [photos, setPhotos] = useState<UserPhoto[]>([]);

  // Helper: convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onerror = rej;
      reader.onload = () => {
        const result = reader.result as string;
        // strip prefix if present
        const comma = result.indexOf(',');
        res(comma >= 0 ? result.slice(comma + 1) : result);
      };
      reader.readAsDataURL(file);
    });
  };

  const takePhoto = async (): Promise<string | undefined> => {
    // Try to use Capacitor Camera + Filesystem via dynamic import so TS doesn't require plugin types at build time
    try {
      // dynamic import may fail if the plugin isn't installed; catch and fallback to web
      // Use an indirect import call to prevent Vite from statically analyzing the import string
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dynamicImport: (p: string) => Promise<any> = new Function('p', 'return import(p)') as any;
      // @ts-ignore - dynamic import, optional dependency
      const cameraModule = await dynamicImport('@capacitor' + '/camera');
      // @ts-ignore - dynamic import, optional dependency
      const filesystemModule = await dynamicImport('@capacitor' + '/filesystem');
      // @ts-ignore - dynamic import, optional dependency
      const coreModule = await dynamicImport('@capacitor' + '/core');

      const Camera = cameraModule.Camera;
      const CameraResultType = cameraModule.CameraResultType;
      const CameraSource = cameraModule.CameraSource;
      const Filesystem = filesystemModule.Filesystem;
      const Directory = filesystemModule.Directory;
      const Capacitor = coreModule.Capacitor;

      const cameraPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        quality: 90,
      });

      const base64Data = cameraPhoto?.base64String;
      if (!base64Data) return undefined;

      const fileName = `${new Date().getTime()}.jpeg`;
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Data,
      });

      let webviewPath: string | undefined = undefined;
      if (Capacitor.getPlatform && Capacitor.getPlatform() === 'web') {
        webviewPath = 'data:image/jpeg;base64,' + base64Data;
      } else if (savedFile?.uri) {
        webviewPath = coreModule.Capacitor.convertFileSrc(savedFile.uri);
      }

      const userPhoto: UserPhoto = {
        filepath: fileName,
        webviewPath,
      };

      setPhotos((prev) => [userPhoto, ...prev]);
      return fileName;
    } catch (err) {
      // Fallback to web file input flow (works in browsers)
      try {
        const file = await new Promise<File | null>((resolve) => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          // hint for mobile devices to open camera
          // @ts-ignore
          input.capture = 'environment';
          input.onchange = () => {
            const f = input.files && input.files[0];
            resolve(f || null);
          };
          input.click();
        });

        if (!file) return undefined;
        const dataUrl = await fileToBase64(file);
        const base64 = dataUrl; // fileToBase64 returns base64 without prefix
        const fileName = `${new Date().getTime()}.jpeg`;
        const webviewPath = 'data:' + file.type + ';base64,' + base64;

        const userPhoto: UserPhoto = { filepath: fileName, webviewPath };
        setPhotos((prev) => [userPhoto, ...prev]);
        return fileName;
      } catch (e) {
        console.error('takePhoto fallback error', e);
        return undefined;
      }
    }
  };

  const deletePhoto = async (photo: UserPhoto) => {
    setPhotos((prev) => prev.filter((p) => p.filepath !== photo.filepath));
    // try to delete from filesystem if available
    try {
      // Use indirect dynamic import to avoid Vite static analysis
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dynamicImport: (p: string) => Promise<any> = new Function('p', 'return import(p)') as any;
      // @ts-ignore - dynamic import, optional dependency
      const filesystemModule = await dynamicImport('@capacitor' + '/filesystem');
      const Filesystem = filesystemModule.Filesystem;
      const Directory = filesystemModule.Directory;
      await Filesystem.deleteFile({ path: photo.filepath, directory: Directory.Data });
    } catch (e) {
      // ignore if filesystem plugin is not available or deletion fails
    }
  };

  return {
    photos,
    takePhoto,
    deletePhoto,
  } as const;
}
