# TaxCode Derleme ve Logo Rehberi

Bu kaynak ağacı üç bağımsız Windows x64 ürünü üretir. Üçü de telemetriyi ürün seviyesinde kapatır ve ayrı kullanıcı verisi klasörleri kullanır.

| Profil | Uygulama adı | Uzantılar | Temel davranış | Çıktı klasörü |
| --- | --- | --- | --- | --- |
| `plugins` | TaxCode | Açık; Open VSX galerisi etkin | Dil, Git ve debug uzantıları dahil | `../TaxCode-plugins-win32-x64` |
| `no-extensions` | TaxCode No Extensions | Yalnızca yerleşik TaxCode temaları yüklenir; uzantı hostu başlatılmaz | Hesap/oturum açma yüzeyleri olmayan sade editör | `../TaxCode-no-extensions-win32-x64` |
| `low-memory` | TaxCode Lite | Yalnızca yerleşik TaxCode temaları yüklenir; uzantı hostu başlatılmaz | Hesapsız, GPU kapalı, deneyler kapalı, seçilebilir V8 sınırı | `../TaxCode-low-memory-win32-x64` |

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

TaxCode profil komutları, Windows paketlerinde kullanılmayan kaynak haritalarını üretmez. Bu seçenek `TAXCODE_BUILD_WITHOUT_SOURCEMAPS=1` olarak yalnızca profil derleme alt sürecine aktarılır; normal VS Code geliştirme derlemelerinin kaynak haritalarını değiştirmez ve düşük disk/RAM ortamında paketlemenin tamamlanabilmesini sağlar. Aynı alt süreçte `TAXCODE_BUILD_WITHOUT_NODE_COMPILE_CACHE=1` kullanılır; böylece extensionsiz profil, başlatılamayan extension-host hazırlık işaretini beklemez. Bu isteğe bağlı performans önbelleğinin atlanması uygulamanın çalışmasını etkilemez.

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

Release etiketi `taxcode-v<sürüm>` biçiminde olmalıdır; örneğin `taxcode-v1.142.0`. Manifest her profil için doğru kurulum dosyasının GitHub adresini ve SHA-256 özetini içerir. Uygulama yalnızca `github.com/Taxperia/TaxCode/releases/download/...` adreslerini kabul eder ve indirilen dosyayı çalıştırmadan önce özeti doğrular.

Bu güncelleyici kodunu içermeyen eski TaxCode sürümleri ilk kez elle kurulmalıdır. Bu sürüm kurulduktan sonra sonraki sürümler `Help > Check for Updates...` ve arka plan güncelleme akışıyla alınabilir.

TaxCode 1.141.0, eski kurulumların kullanıcı ayarlarında bıraktığı `"update.mode": "none"` değerini ilk açılışta bir kez `default` değerine taşır. Böylece `Help > Check for Updates...` yeniden görünür ve arka plan denetimi çalışır. Bu tek seferlik geçişten sonra kullanıcının güncelleme modunda yaptığı değişiklikler korunur; yönetim ilkesiyle kapatılmış güncellemeler değiştirilmez.

> Önemli: GitHub Release yalnızca kaynak kodu içeriyorsa otomatik güncelleme çalışmaz. `taxcode-update.json` ve üç profilin kurulum EXE dosyaları aynı **en güncel yayımlanmış release** içinde bulunmalıdır. Manifest URL'sinin 404 dönmesi durumunda uygulama yeni sürümü göremez.

Doğrudan Gulp kullanmak isterseniz `TAXCODE_BUILD_PROFILE` ortam değişkenini `plugins`, `no-extensions` veya `low-memory` yapıp `vscode-win32-x64-min` görevini çalıştırın. Ortam değişkeni verilmezse `plugins` profili seçilir.

## Ana Logoyu Değiştirme

Windows markasının tek kaynak dosyası kökteki `taxcode.ico` dosyasıdır. Ejder logosunu daha sonra değiştirmek için aynı adla yeni bir çok çözünürlüklü ICO koymanız yeterlidir:

```text
taxcode.ico
```

Önerilen ICO katmanları: 16, 24, 32, 48, 64, 128 ve 256 piksel; şeffaf arka plan kullanın. Derleme sırasında 70x70 ve 150x150 Windows karo görsellerinin yanında Inno Setup'ın bütün DPI boyutlarındaki büyük/küçük kurulum görselleri de bu ICO'dan otomatik üretilir. Üretilen geçici dosyalar `.build/taxcode/win32` altındadır; elle düzenlenmemelidir.

Windows logosunu kullanan noktalar:

| Yer | Görev |
| --- | --- |
| `taxcode.ico` | Tek kaynak ejder ikonu |
| `build/lib/electron.ts` | EXE içine gömülen Electron ikonu |
| `build/win32/code.iss` | Windows kurulum dosyasının ikonu |
| `build/gulpfile.vscode.win32.ts` | Güncelleyici EXE ikonu |
| `build/gulpfile.vscode.ts` | Paket içindeki `resources/win32/code.ico` ve karo görselleri |
| `build/taxcode/generate-brand-assets.ps1` | Karo PNG'leri ve Inno Setup ejderha BMP'lerinin üretimi |
| `resources/win32/VisualElementsManifest.xml` | Başlat menüsü karo yolları ve ürün adı |
| `src/vs/platform/windows/electron-main/windows.ts` | Kaynaktan çalıştırılan geliştirme penceresinin ikonu |

`resources/win32/code.ico`, `code_70x70.png` ve `code_150x150.png` eski Code OSS varlıkları olarak kaynakta durabilir; TaxCode Windows paketleme akışı bunların yerine `taxcode.ico` ve ondan üretilen görselleri koyar.

Kurulum penceresindeki yayımlayıcı/destek/güncelleme bağlantıları ile yeniden boyutlandırma davranışı da `build/win32/code.iss` içindedir. TaxCode kurulumu yeniden boyutlandırılamaz; bu nedenle başlık çubuğundaki büyütme düğmesi gösterilmez. Kapatma düğmesi standart Windows davranışı olarak korunur.

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

## Yerleşik Temaları Değiştirme

TaxCode'a eklenen yerleşik temalar `extensions/theme-taxcode` klasöründedir. Üç profil de bu paketteki saf renk temalarını okuyabilir; pluginsiz ve Lite profillerinde uzantı hostu yine başlatılmaz.

| Tema | Dosya |
| --- | --- |
| TaxCode Purple | `extensions/theme-taxcode/themes/taxcode-purple-color-theme.json` |
| TaxCode GitHub Dark | `extensions/theme-taxcode/themes/taxcode-github-dark-color-theme.json` |
| TaxCode GitHub Light | `extensions/theme-taxcode/themes/taxcode-github-light-color-theme.json` |

Tema adları ve paket açıklaması `extensions/theme-taxcode/package.nls.json` ile Türkçe karşılıkları `extensions/theme-taxcode/package.nls.tr.json` içindedir. Yeni tema eklerken tema JSON dosyasını oluşturup `extensions/theme-taxcode/package.json` içindeki `contributes.themes` listesine kaydedin.

## Profil Ayarlarını Değiştirme

Üç profilin adları, Windows GUID'leri, veri klasörleri, bellek sınırı ve uzantı davranışı `build/taxcode/profile.ts` dosyasındadır. Ortak TaxCode geliştirme kimliği ise `product.json` içindedir.

Lite bellek sınırını değiştirmek için Komut Paleti'nden **TaxCode: Set RAM Limit** komutunu çalıştırın. 256, 512, 768 ve 1024 MB seçenekleri `argv.json` içindeki `taxcode-memory-limit` alanına yazılır ve yeniden başlatmanın ardından uygulanır. Bu değer uygulamanın toplam RAM'ini değil, Electron/V8 JavaScript heap üst sınırını kontrol eder. Çok düşük bir değer büyük çalışma alanlarında sekmenin kapanmasına yol açabilir; mevcut 512 MB sınırı önerilen başlangıç noktasıdır.

Varsayılanı veya seçenek listesini kaynakta değiştirmek için `build/taxcode/profile.ts` içindeki `taxCodeDefaultMaxOldSpaceSize` ve `taxCodeMemoryLimitOptions` alanlarını düzenleyin.

Pluginli sürüm Open VSX kullanır. Microsoft Visual Studio Marketplace uç noktalarını bu forka eklemeyin; Microsoft Marketplace kullanım koşulları üçüncü taraf ürünlerde farklı kısıtlar uygulayabilir.

GitHub Copilot, TaxCode paketine yerleşik olarak eklenmez. Bunun iki nedeni vardır: yerel OSS paketleme akışında SDK bağımlılıklarının güvenilir biçimde taşınmaması ve telemetrisiz genel dağıtımın bu hesaba bağlı uzantıdan bağımsız tutulması. Pluginli sürümün genel uzantı hostu ve Open VSX galerisi tam olarak açıktır.

> Not: `defaultChatAgent` alanı yalnızca çekirdek workbench uyumluluğu için `product.json` içinde korunur. Bu alanın bulunması GitHub Copilot eklentisinin pakete dahil edildiği anlamına gelmez. Alan kaldırılırsa VS Code 1.142 çekirdeğindeki onboarding, varsayılan hesap ve galeri servisleri workbench açılmadan hata verebilir. TaxCode profillerinde otomatik AI onboarding ayrıca kapalıdır.
