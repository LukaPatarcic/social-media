import Compressor from "compressorjs";
import React,{Component} from "react";

export default class ImageCompression {
    compressedImage;
    constructor() {
        this.compressedImage = null;
    }

    dataURLtoFile(dataurl, filename) {

        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, {type:mime});
    }

    static getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    compressImages(file) {
        const img = this.dataURLtoFile(file.src.base64, file.src.file.name);
        if (!img) {
            return;
        }

        let obj = new Compressor(img, {
            quality: 0.6,
            success(result) {
                return result;
            },
            error(err) {
                console.log(err.message);
            },
        });

        return obj.file;
    }
}