"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageUploadService = exports.ImageUploadService = void 0;
const fs_1 = __importDefault(require("fs"));
const config_1 = require("../config");
const errors_1 = require("../errors");
/**
 * Class: imageUploadService
 * -------------------------
 * This class provides methods for uploading and deleting images using Cloudinary.
 */
class ImageUploadService {
    constructor() {
        this.generateRandom10DigitNumber = () => {
            return Math.floor(1000000000 + Math.random() * 9000000000).toString();
        };
    }
    /**
     * Method: imageUpload
     * -------------------
     * Uploads an image to Cloudinary.
     *
     * @param folderName - A string representing the destination folder for the uploaded image.
     * @param file - The uploaded file to be processed.
     * @returns A Promise that resolves to the uploaded image information.
     */
    async imageUpload(folderName, file) {
        try {
            // Extract the image type from the file's mimetype
            const imageType = file.mimetype.split('/')[0];
            // Check if the file is an image
            if (imageType !== 'image') {
                throw new errors_1.BadRequestError('Enter valid image type');
            }
            // Extract the filename without extension
            // const fileNameWithoutExtension = file.name.substring(0, file.name.lastIndexOf('.'));
            // const fileName = `${fileNameWithoutExtension.toLocaleUpperCase()}-${this.generateRandom10DigitNumber()}`;
            const { tempFilePath } = file;
            // Upload the image to Cloudinary
            const fileInfo = await config_1.cloudinary.uploader.upload(tempFilePath, {
                // timeout: 12000000,
                // resource_type: "auto",
                // public_id: `Nithub/${folderName}/${fileName}`,
                chunk_size: 8000001,
                use_filename: true,
            });
            // Delete the temporary file generated when uploading the image
            fs_1.default.unlinkSync(tempFilePath);
            // Remove the API key from the fileInfo object
            delete fileInfo.api_key;
            return fileInfo;
        }
        catch (err) {
            if (err instanceof errors_1.ApiError) {
                throw err;
            }
            throw new Error(err?.message);
        }
    }
    /**
     * Method: imageUpload
     * -------------------
     * Uploads Images in Bulk to Cloudinary.
     *
     * @param folderName - A string representing the destination folder for the uploaded image.
     * @param files - An Array of uploaded files to be processed.
     * @returns A Promise that resolves to the uploaded images information.
     */
    async bulkUpload(folderName, files) {
        try {
            const response = [];
            await Promise.all(files.map(async (file) => {
                const fileInfo = await this.imageUpload(folderName, file);
                response.push(fileInfo);
            }));
            return response;
        }
        catch (err) {
            console.log(err);
            if (err instanceof errors_1.ApiError) {
                throw err;
            }
            throw new Error(err.error.message);
        }
    }
    /**
     * Method: deleteImage
     * --------------------
     * Deletes an image from Cloudinary using its public ID.
     *
     * @param filePublicId - An array of public IDs of the images to be deleted.
     * @returns A Promise that resolves to the result of the image deletion operation.
     */
    async deleteImage(filePublicId) {
        try {
            // Delete the file(s) using the public ID(s)
            const deletedFile = await config_1.cloudinary.api.delete_resources(filePublicId, {
                resource_type: 'image',
            });
            return deletedFile;
        }
        catch (err) {
            throw new Error(err.error.message);
        }
    }
}
exports.ImageUploadService = ImageUploadService;
exports.imageUploadService = new ImageUploadService();
