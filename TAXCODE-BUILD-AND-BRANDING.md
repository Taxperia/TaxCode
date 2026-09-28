# TaxCode Derleme ve Logo Rehberi

Bu kaynak ağacı üç bağımsız Windows x64 ürünü üretir. Üçü de telemetriyi ürün seviyesinde kapatır ve ayrı kullanıcı verisi klasörleri kullanır.

| Profil | Uygulama adı | Uzantılar | Temel davranış | Çıktı klasörü |
| --- | --- | --- | --- | --- |
| `plugins` | TaxCode | Açık; Open VSX galerisi etkin | Dil, Git ve debug uzantıları dahil | `../TaxCode-plugins-win32-x64` |
| `no-extensions` | TaxCode No Extensions | Paketlenmez ve uzantı hostu başlatılmaz | Sade editör | `../TaxCode-no-extensions-win32-x64` |
| `low-memory` | TaxCode Lite | Paketlenmez ve uzantı hostu başlatılmaz | GPU kapalı, deneyler kapalı, V8 üst sınırı 512 MB | `../TaxCode-low-memory-win32-x64` |

Profillerin uygulama kimlikleri, protokolleri ve veri klasörleri farklıdır. Bu nedenle aynı Windows kurulumunda yan yana çalışabilirler.

## Derleme

Gerekli Node.js sürümü kökteki `.nvmrc` dosyasında yazılıdır. Önce bağımlılıkları kurun:

```powershell
npm.cmd install
```

Profil tanımlarını hızlıca doğrulamak için:

```powershell
npm.cmd run taxcode:check-profiles
```

Tek tek veya toplu derleme komutları:

```powershell
npm.cmd run taxcode:build:plugins
npm.cmd run taxcode:build:no-extensions
npm.cmd run taxcode:build:low-memory
npm.cmd run taxcode:build:all
```

Kullanıcı kurulum dosyası da üretmek için karşılık gelen `setup` komutlarını kullanın:

```powershell
npm.cmd run taxcode:setup:plugins
npm.cmd run taxcode:setup:no-extensions
npm.cmd run taxcode:setup:low-memory
npm.cmd run taxcode:setup:all
```

## GitHub Üzerinden Otomatik Güncelleme

TaxCode, Windows kullanıcı kurulumunda VS Code'un yerleşik güncelleme arayüzünü kullanır. Güncelleme denetimi Microsoft sunucularına değil, Taxperia/TaxCode deposundaki en son GitHub Release içine yüklenen `taxcode-update.json` dosyasına gider:

```text
https://github.com/Taxperia/TaxCode/releases/latest/download/taxcode-update.json
```

`taxcode:setup:all` üç kurulum dosyasını `.build/taxcode/installers` klasörüne kopyalar ve hepsi hazır olduğunda manifesti otomatik üretir. Bir sürümü yayımlarken aynı GitHub Release içine şu dört dosyanın tamamını yükleyin:

```text
TaxCode-<sürüm>-Plugins-UserSetup-x64.exe
TaxCode-<sürüm>-NoExtensions-UserSetup-x64.exe
TaxCode-<sürüm>-LowMemory-UserSetup-x64.exe
taxcode-update.json
```

Release etiketi `taxcode-v<sürüm>` biçiminde olmalıdır; örneğin `taxcode-v1.139.2`. Manifest her profil için doğru kurulum dosyasının GitHub adresini ve SHA-256 özetini içerir. Uygulama yalnızca `github.com/Taxperia/TaxCode/releases/download/...` adreslerini kabul eder ve indirilen dosyayı çalıştırmadan önce özeti doğrular.

Bu güncelleyici kodunu içermeyen eski TaxCode sürümleri ilk kez elle kurulmalıdır. Bu sürüm kurulduktan sonra sonraki sürümler `Help > Check for Updates...` ve arka plan güncelleme akışıyla alınabilir.

Doğrudan Gulp kullanmak isterseniz `TAXCODE_BUILD_PROFILE` ortam değişkenini `plugins`, `no-extensions` veya `low-memory` yapıp `vscode-win32-x64-min` görevini çalıştırın. Ortam değişkeni verilmezse `plugins` profili seçilir.

## Ana Logoyu Değiştirme

Windows markasının tek kaynak dosyası kökteki `taxcode.ico` dosyasıdır. Ejder logosunu daha sonra değiştirmek için aynı adla yeni bir çok çözünürlüklü ICO koymanız yeterlidir:

```text
taxcode.ico
```

Önerilen ICO katmanları: 16, 24, 32, 48, 64, 128 ve 256 piksel; şeffaf arka plan kullanın. Derleme sırasında 70x70 ve 150x150 Windows karo görselleri bu ICO'dan otomatik üretilir. Üretilen geçici dosyalar `.build/taxcode/win32` altındadır; elle düzenlenmemelidir.

Windows logosunu kullanan noktalar:

| Yer | Görev |
| --- | --- |
| `taxcode.ico` | Tek kaynak ejder ikonu |
| `build/lib/electron.ts` | EXE içine gömülen Electron ikonu |
| `build/win32/code.iss` | Windows kurulum dosyasının ikonu |
| `build/gulpfile.vscode.win32.ts` | Güncelleyici EXE ikonu |
| `build/gulpfile.vscode.ts` | Paket içindeki `resources/win32/code.ico` ve karo görselleri |
| `build/taxcode/generate-brand-assets.ps1` | 70x70 ve 150x150 PNG üretimi |
| `resources/win32/VisualElementsManifest.xml` | Başlat menüsü karo yolları ve ürün adı |
| `src/vs/platform/windows/electron-main/windows.ts` | Kaynaktan çalıştırılan geliştirme penceresinin ikonu |

`resources/win32/code.ico`, `code_70x70.png` ve `code_150x150.png` eski Code OSS varlıkları olarak kaynakta durabilir; TaxCode Windows paketleme akışı bunların yerine `taxcode.ico` ve ondan üretilen görselleri koyar.

## Diğer Platformların Logo Noktaları

Windows dışı paketler de hazırlanacaksa ilgili platformun doğal formatında ayrıca logo üretin:

| Platform/yüzey | Değiştirilecek dosya |
| --- | --- |
| Linux masaüstü | `resources/linux/code.png` |
| macOS uygulaması | `resources/darwin/code.icns` |
| Web favicon | `resources/server/favicon.ico` |
| Web/PWA | `resources/server/code-192.png`, `resources/server/code-512.png` |
| Web manifest adı | `resources/server/manifest.json` |
| macOS DMG | `resources/darwin/code.icns` |

Bu dosyalar Windows profil derlemelerinde kullanılmaz. ICO dosyasını doğrudan ICNS yerine koymayın; macOS için gerçek bir `.icns` dosyası üretin.

## Profil Ayarlarını Değiştirme

Üç profilin adları, Windows GUID'leri, veri klasörleri, bellek sınırı ve uzantı davranışı `build/taxcode/profile.ts` dosyasındadır. Ortak TaxCode geliştirme kimliği ise `product.json` içindedir.

Lite bellek sınırını değiştirmek için `taxCodeDefaultMaxOldSpaceSize` değerini düzenleyin. Çok düşük bir değer büyük çalışma alanlarında sekmenin kapanmasına yol açabilir; mevcut 512 MB sınırı başlangıç noktasıdır.

Pluginli sürüm Open VSX kullanır. Microsoft Visual Studio Marketplace uç noktalarını bu forka eklemeyin; Microsoft Marketplace kullanım koşulları üçüncü taraf ürünlerde farklı kısıtlar uygulayabilir.

GitHub Copilot, TaxCode paketine yerleşik olarak eklenmez. Bunun iki nedeni vardır: yerel OSS paketleme akışında SDK bağımlılıklarının güvenilir biçimde taşınmaması ve telemetrisiz genel dağıtımın bu hesaba bağlı uzantıdan bağımsız tutulması. Pluginli sürümün genel uzantı hostu ve Open VSX galerisi tam olarak açıktır.

> Not: `defaultChatAgent` alanı yalnızca çekirdek workbench uyumluluğu için `product.json` içinde korunur. Bu alanın bulunması GitHub Copilot eklentisinin pakete dahil edildiği anlamına gelmez. Alan kaldırılırsa VS Code 1.140 çekirdeğindeki onboarding, varsayılan hesap ve galeri servisleri workbench açılmadan hata verebilir. TaxCode profillerinde otomatik AI onboarding ayrıca kapalıdır.
