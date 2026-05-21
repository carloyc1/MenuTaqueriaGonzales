Add-Type -AssemblyName System.Drawing

function Crop-Image($sourcePath, $destPath, $x, $y, $w, $h) {
    try {
        $src = New-Object System.Drawing.Bitmap($sourcePath)
        $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
        $cropped = $src.Clone($rect, $src.PixelFormat)
        $cropped.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $cropped.Dispose()
        $src.Dispose()
        Write-Host "Cropped $sourcePath to $destPath successfully."
    } catch {
        Write-Host "Error cropping $sourcePath to $destPath : $_"
    }
}

# Crop from image.png (1280 x 853)
# Let's crop candidate regions in image.png where the logo might be
Crop-Image "d:\KnowMagic\Proyectos\TaqueriaGonzales\image.png" "d:\KnowMagic\Proyectos\TaqueriaGonzales\logo_crop_a1.png" 540 20 200 200
Crop-Image "d:\KnowMagic\Proyectos\TaqueriaGonzales\image.png" "d:\KnowMagic\Proyectos\TaqueriaGonzales\logo_crop_a2.png" 500 15 280 280
Crop-Image "d:\KnowMagic\Proyectos\TaqueriaGonzales\image.png" "d:\KnowMagic\Proyectos\TaqueriaGonzales\logo_crop_a3.png" 40 40 250 250
Crop-Image "d:\KnowMagic\Proyectos\TaqueriaGonzales\image.png" "d:\KnowMagic\Proyectos\TaqueriaGonzales\logo_crop_math.png" 440 5 400 400

# Crop from image copy.png (393 x 590)
# Let's crop candidate regions in image copy.png where the logo might be
Crop-Image "d:\KnowMagic\Proyectos\TaqueriaGonzales\image copy.png" "d:\KnowMagic\Proyectos\TaqueriaGonzales\logo_crop_b1.png" 100 20 200 200
Crop-Image "d:\KnowMagic\Proyectos\TaqueriaGonzales\image copy.png" "d:\KnowMagic\Proyectos\TaqueriaGonzales\logo_crop_b2.png" 190 20 180 180
Crop-Image "d:\KnowMagic\Proyectos\TaqueriaGonzales\image copy.png" "d:\KnowMagic\Proyectos\TaqueriaGonzales\logo_crop_b3.png" 220 10 160 160
