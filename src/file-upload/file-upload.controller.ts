import { Controller, FileTypeValidator, MaxFileSizeValidator, Param, ParseFilePipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('files')
export class FileUploadController {
    constructor(private readonly fileUploadService: FileUploadService){}

    @UseGuards(AuthGuard)
    @Post('uploadImage/:id')
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@Param('id') productId: string, @UploadedFile(new ParseFilePipe({
        validators:[
            new MaxFileSizeValidator({
                maxSize:200000,
                message: 'File is too large'
            }),
            new FileTypeValidator({
                fileType: /.(jpg|jpeg|png|webp|gif|svg)$/
            })
        ]
    })) file:Express.Multer.File){
        return this.fileUploadService.uploadImage(file, productId)
    }
}
