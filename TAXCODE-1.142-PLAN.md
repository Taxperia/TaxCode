# TaxCode 1.142.0 Güncelleme ve Özellik Önerileri

> Durum: 1.142.0 taban güncellemesi, telemetri kapıları, hesapsız pluginsiz/Lite profilleri, yerleşik temalar ve Lite RAM seçimi uygulanmaktadır. Aşağıdaki diğer maddeler sonraki sürümler için fikir havuzudur.

## 1.142.0 ile Gelen Temel Yenilikler

VS Code 1.142.0, 14 Ekim 2026 tarihinde yayımlandı. Resmî sürüm notlarında öne çıkan yenilikler:

- Agent iş akışları için Canvas önizlemesi.
- Sohbet geçmişini kaybetmeden başka klasöre veya Git worktree'ye taşıma.
- Görsel yapıştırma, bağlantı yeniden adlandırma, outline ve breadcrumb destekli Markdown editörü.
- Yenilenmiş model seçici ve BYOK model ayarları.
- Agent izinleri ve sandbox politikaları için daha ayrıntılı yönetim.
- Çoklu sağlayıcılardan gelen belge vurgularını birleştirme seçeneği.
- Birçok bellek sızıntısı, terminal ve agent-host düzeltmesi.

Kaynak: https://code.visualstudio.com/updates/v1_142

## Bu Sürümde Uygulanan TaxCode Ekleri

- Pluginsiz ve Lite profillerinde hesap düğmesi, Settings Sync tanıtımı ve Copilot oturum açma/promosyon bileşenleri kapatıldı.
- `TaxCode Purple`, `TaxCode GitHub Dark` ve `TaxCode GitHub Light` temaları üç pakete de yerleşik eklendi.
- Lite profiline Komut Paleti üzerinden çalışan **TaxCode: Set RAM Limit** komutu eklendi.
- Lite için 256, 512, 768 ve 1024 MB V8 heap seçenekleri tanımlandı; varsayılan 512 MB olarak korundu.
- Telemetri ürün ayarları kapalı tutuldu ve Copilot/özelleştirme telemetri katkıları telemetri kapalıyken kaydedilmiyor.

## Güncelleme Sırasında Korunacak TaxCode Özellikleri

- Üç ayrı ürün korunacak: `plugins`, `no-extensions`, `low-memory`.
- Uygulama kimlikleri ve kullanıcı veri klasörleri ayrı kalacak.
- `taxcode.ico` ile uygulama, dosya ve kurulum ejderha markalaması korunacak.
- Open VSX yalnızca pluginli profilde etkin olacak.
- Pluginsiz ve düşük RAM profillerinde extension host başlatılmayacak.
- Düşük RAM profilinde GPU kapalı, deneyler kapalı ve varsayılan V8 sınırı 512 MB olacak.
- GitHub Release tabanlı profil güvenli güncelleme sistemi ve SHA-256 doğrulaması korunacak.
- Eski `update.mode: none` geçişi ve **Güncellemeleri Denetle** komutu korunacak.

## Telemetri ve Gizlilik Kontrolü

1.142.0 kaynağı alınırken telemetriyle ilgili her upstream değişiklik ayrıca incelenecek. Aşağıdaki TaxCode kuralları üç profilde de zorunlu olacak:

- `enableTelemetry: false`
- `removeTelemetryMachineId: true`
- `showTelemetryOptOut: false`
- Microsoft telemetri, deney ve crash-report uç noktalarının ürün yapılandırmasında bulunmaması.
- Paketlenmiş `product.json` dosyalarının otomatik test edilmesi.
- Telemetri seviyesinin kullanıcı arayüzünde yeniden açılmasını engelleyen TaxCode varsayılanı.
- Agent/Copilot telemetrisinin, açıkça istenen model isteklerinden ayrı değerlendirilmesi.
- Güncelleme, Open VSX ve kullanıcının bilerek başlattığı çevrimiçi AI isteklerinin gizlilik raporunda ayrı gösterilmesi.

Telemetri kütüphanelerini körlemesine silmek yerine önce bağımlılıkları incelenecek. VS Code API uyumluluğu için gerekli fakat TaxCode'da devre dışı kalan modüller varsa, ağ erişimi ve olay gönderimi kapatılarak korunacak. Güvenle çıkarılabilen telemetri bağımlılıkları paketlerden kaldırılacak.

## TaxCode'a Upstream'den Bağımsız Ekleyebileceğimiz Özellikler

Bu özelliklerin mümkün olduğunca `extensions/taxcode-*` altında yerleşik TaxCode eklentileri şeklinde geliştirilmesi önerilir. Böylece sonraki VS Code güncellemelerinde çekirdek çatışmaları azalır.

### 1. TaxCode Kontrol Merkezi — İlk Önerim

Tek bir ekrandan:

- Kullanılan TaxCode profilini ve sürümünü gösterme.
- Güncelleme kontrolü ve sürüm notları.
- Tema, ikon ve başlangıç ayarları.
- Ayarları dışa aktarma, içe aktarma ve sıfırlama.
- Gizlilik durumu ve izin verilen ağ servisleri.
- Düşük RAM önerilerini tek tıkla uygulama.

Bu özellik marka kimliğini güçlendirir ve diğer öneriler için ortak bir merkez oluşturur.

### 2. Gizlilik ve Ağ Etkinliği Paneli

- TaxCode çekirdeğinin bağlandığı alan adlarını anlaşılır şekilde gösterme.
- Güncelleme, Open VSX ve AI servislerini ayrı kategorilerde listeleme.
- Son bağlantı zamanı ve bağlantının hangi özellik tarafından başlatıldığını gösterme.
- İsteğe bağlı katı çevrimdışı mod.
- Telemetrinin kapalı olduğunu doğrulayan yerel durum raporu.

Panel ağ trafiğini gizlice kaydetmemeli; yalnızca uygulamanın kendi servis çağrılarını yerel ve geçici olarak raporlamalıdır.

### 3. Proje Başlatıcı ve Şablon Galerisi

- Node.js, TypeScript, Python, C#, web ve boş proje şablonları.
- Şablonların Taxperia GitHub deposundan indirilebilmesi.
- Topluluk şablonları için imzalı manifest ve SHA-256 doğrulaması.
- Komut çalıştırmadan önce oluşturulacak dosyaları önizleme.
- Tamamen çevrimdışı kullanılabilen temel şablon paketi.

### 4. Çalışma Alanı Sağlık Merkezi

- Büyük dosyalar, gereksiz build çıktıları ve unutulmuş geçici klasörler için analiz.
- Git durumu, Node/Python sürümü ve eksik araç kontrolleri.
- `node_modules`, cache veya log temizliği öncesinde güvenli önizleme.
- Projeye göre önerilen ayarlar ve görevler.
- Hiçbir dosyayı kullanıcı onayı olmadan silmeme.

### 5. Gelişmiş Lite/VDS Modu

- 256 MB, 512 MB ve 768 MB bellek ön ayarları.
- Dosya izleyici ve arama kapsamını büyük klasörlerde otomatik daraltma önerisi.
- Animasyon, minimap, semantic highlighting ve ağır arka plan işlerini tek merkezden yönetme.
- RAM ve CPU kullanımını gösteren hafif durum çubuğu öğesi.
- Uygulamayı yeniden başlatmadan önce değişikliklerin özetini gösterme.

Varsayılan profil yine güvenli 512 MB olarak kalmalıdır; daha düşük sınırlar kullanıcı seçimi olmalıdır.

### 6. TaxCode Yedekleme ve Taşınabilir Profil

- Ayarlar, keybindings, snippets, görevler ve seçilen eklenti listesini tek arşive aktarma.
- Gizli anahtarları ve oturum tokenlarını varsayılan olarak arşive almama.
- Başka bilgisayarda veya VDS üzerinde profili geri yükleme.
- İsteğe bağlı taşınabilir çalışma dizini oluşturma.

### 7. Güvenli Eklenti Kataloğu

- Open VSX sonuçlarının yanında izinler ve bilinen ağ erişimi hakkında özet.
- Taxperia tarafından denenmiş eklentiler için ayrı koleksiyon.
- Eklenti yüklemeden önce boyut, yayıncı ve son güncelleme bilgisini gösterme.
- Düşük RAM profiline ağır eklenti yükleme yerine pluginli profile geçiş önerisi.

### 8. TaxCode Komutları ve Tanılama Paketi

- **TaxCode: Sistem Raporu Oluştur** komutu.
- **TaxCode: Güncellemeleri Denetle** kısayolu.
- **TaxCode: Güvenli Modda Yeniden Başlat** komutu.
- **TaxCode: Profil ve Gizlilik Durumunu Göster** komutu.
- Paylaşılacak tanılama raporundan kullanıcı adı, yol ve token gibi özel verileri otomatik temizleme.

## Önerilen İlk Uygulama Paketi

1. TaxCode 1.142.0 çekirdek güncellemesi ve telemetri gizlilik kapısı.
2. Üç profil ve otomatik güncelleme testleri.
3. TaxCode Kontrol Merkezi'nin temel sürümü.
4. Gizlilik durumu ve sistem raporu ekranı.
5. Lite/VDS için 256/512/768 MB ön ayarları.

Proje şablonları, yedekleme ve güvenli eklenti kataloğu sonraki sürümlere bırakılabilir. Bu sıra, 1.142.0 güncellemesini gereksiz yere büyütmeden TaxCode'a görünür ve sürdürülebilir bir fark kazandırır.

## Güncelleme Onaylanırsa İzlenecek Yol

1. Resmî `microsoft/vscode` 1.142.0 etiketi alınacak ve TaxCode değişiklikleri korunarak birleştirilecek.
2. Yeni telemetri, deney, crash-report ve agent telemetry yolları denetlenecek.
3. Üç profil testi, güncelleme manifesti testi ve hedefli TypeScript kontrolleri çalıştırılacak.
4. Üç Windows x64 kurulum EXE'si üretilecek ve sürüm/profil bilgileri doğrulanacak.
5. SHA-256 değerli `taxcode-update.json` üretilecek.
6. Kaynak kod, `taxcode-v1.142.0` etiketi ve dört release asseti GitHub'a yüklenecek.
