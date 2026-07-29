# TaxCode Icin 200 Ozellik ve Gelistirme Fikri

Bu liste; telemetry kapali dagitim, eklentili/eklentisiz profiller ve dusuk RAM VDS kullanimi temel alinarak hazirlandi. Maddeler tek tek uygulanabilir, olculebilir ve surum planina alinabilir fikirlerdir.

## 1. Profil ve Dagitim Deneyimi

001. Ilk acilista `VDS`, `Sade`, `Eklentili` ve `Tam Gelistirme` profillerini secilebilen bir kurulum ekrani sun.
002. Kurulumdan sonra profil degistirmeyi veri kaybetmeden yapan bir `Profili Degistir` komutu ekle.
003. Her profil icin tahmini disk, RAM ve baslangic suresi bilgisini kurulumda goster.
004. Profil paketlerinin imzali SHA-256 manifestini yayinla ve uygulama icinden dogrula.
005. USB uzerinden calisan tasinabilir, telemetrysiz bir paket secenegi ekle.
006. Profil ayarlarini JSON dosyasi olarak disa aktarma ve baska makineye alma ozelligi ekle.
007. Kurumsal dagitim icin sessiz kurulum bayraklarini belgeli ve testli hale getir.
008. Eski profil verisini algilayip yeni surume kontrollu tasiyan goc sihirbazi sun.
009. Installer icinde sadece secilen profile ait dosyalari tasiyarak paket boyutunu dusur.
010. Profil adi ve amacini `About` penceresinde acikca gostererek destek taleplerini kolaylastir.

## 2. Dusuk RAM ve VDS Modu

011. Bellek esigi asildiginda istege bagli olarak animasyon, minimap ve onizlemeleri otomatik kapat.
012. VDS profili icin extension host acilmadan duz metin duzenlemeye yarayan ultra hafif mod sun.
013. Kullanilmayan editor sekmelerini bellekten uyutup tiklandiginda hizla geri yukle.
014. Dosya izleyici kapsamlarini buyuk klasorlerde otomatik daraltan VDS ayari ekle.
015. Arka plandaki Git yenileme sikligini VDS profilinde akilli bicimde azalt.
016. Terminal scrollback satir limitini RAM butcesine gore ayarlayan profil secenegi sun.
017. Buyuk dosyalar icin syntax, minimap ve CodeLens'i otomatik azaltan bellek dostu goruntuleyici ekle.
018. Bellek kullanimini durum cubugunda sade bir gostergeyle izlenebilir yap.
019. Uzak masaustu baglantisinda GPU sorunlarini algilayip yazilim render ayarini oneren tanilama ekle.
020. Acilis sirasinda gecikme yaratan modulleri olcen ve VDS icin kapatilabilecekleri listeleyen rapor uret.

## 3. Gizlilik ve Telemetrysiz Guvence

021. Uygulama icinde `Gizlilik Durumu: Telemetry Kapali` ekranini, etkili ayarlar ve kod durumu ile goster.
022. Ag isteklerini alan adina gore canli listeleyen, yalniz yerel tutulan gizlilik gunlugu ekle.
023. Telemetrysiz profilde bilinmeyen analitik endpointlerine cikisi engelleyen izin listesi modu sun.
024. Eklentili profilde her eklentinin ag erisimini ve veri klasorunu goruntuleyen panel ekle.
025. Hassas dosyalarda panoya kopyalanan icerigi sureli temizleme secenegi sun.
026. Crash dump uretimini varsayilan yerel ve kullanici onayli disa aktarma akisi ile sinirla.
027. Ayar esitleme acilirsa hangi dosya ve anahtarlarin gidecegini onizleten gizlilik ekrani sun.
028. Gizlilik varsayilanlarinin profil guncellemelerinde bozulmadigini test eden otomatik kontrol ekle.
029. Uygulamanin yaptigi tum harici baglantilar icin okunabilir bir `network-policy.json` yayinla.
030. Gizlilik politikasindaki degisiklikleri surum notunda fark olarak gosteren bir rapor uret.

## 4. Guvenlik Temeli

031. Her paketleme oncesi `npm audit --omit=dev` sonucunu esiklerle kontrol eden release kapisi ekle.
032. Kaynak agacinda `.pfx`, token ve ozel anahtar arayan secret scan adimi ekle.
033. Imza sertifikalarini yalniz CI secret store uzerinden erisilebilir hale getir.
034. Yuklenen eklentiler icin imza ve hash dogrulamasi politikasi sun.
035. Marketplace eklentileri icin izin ozeti ve risk puani goruntule.
036. Calisma alani guvenini tum dagitim profillerinde varsayilan acik tut.
037. Terminal komutu yapistirilirken cok satirli veya zararli desenler icin uyarili onizleme ekle.
038. Link acma islemlerinde dis alan adi ve protokol icin belirgin onay ekrani sun.
039. Guvenlik yamasi mevcutsa normal guncellemeler kapali olsa bile yerel bildirim verecek kanal tasarla.
040. SBOM ureten ve installer ile birlikte imzali olarak yayinlayan release isi ekle.

## 5. Eklenti Guvenligi ve Izolasyonu

041. Eklentileri `ag yok`, `dosya sinirli` ve `tam izinli` calistirma siniflarina ayir.
042. Proje bazinda izin verilen eklentiler listesi olusturup digerlerini otomatik pasiflestir.
043. Eklenti basina CPU ve RAM butcesi koyup asimda kullaniciya durdurma secenegi sun.
044. Son yuklenen eklenti sonrasi acilis bozulursa otomatik guvenli baslatma modu ekle.
045. Marketplace disindan VSIX kurulumunda hash ve yayinci uyarisini zorunlu yap.
046. Kurumsal eklenti deposunu offline imzali katalog olarak destekle.
047. Eklenti ayar degisikliklerini denetlenebilir bir yerel gecmis ekraninda goster.
048. Eklenti kaldirilirken olusturdugu token ve cache klasorlerini secimli temizle.
049. Proje guven seviyesi dusukse terminal veya kimlik bilgisi isteyen eklentileri askida tut.
050. Eklenti host cokmesi halinde hangi eklentinin son calistigini gosteren yerel analiz raporu uret.

## 6. Performans ve Kaynak Izleme

051. Acilis suresini profil ve surum bazinda yerel olarak karsilastiran performans paneli ekle.
052. Dosya arama, Git ve terminal islemlerinin RAM/CPU payini sade grafiklerle goster.
053. Performans kaydi alirken hicbir veriyi disariya gondermeyen bir destek paketi uret.
054. Asiri buyuk workspace icin otomatik `exclude` oneri motoru ekle.
055. Dosya izleme tarafinda en cok olay ureten klasorleri listeleyen tanilama sun.
056. Pil veya dusuk guc modunda pahali arka plan islemlerini erteleyen calisma modu ekle.
057. Acik editor sayisina gore onizleme ve breadcrumb maliyetini azaltan adaptif arayuz sun.
058. Eklenti baslangic surelerini izleyip gec baslayanlari tek tikla devre disi birak.
059. Terminal ve webview islemleri icin bellek siniri uyarisi ve yeniden baslatma butonu ekle.
060. Profil ayarlarinin gercek performans etkisini olcen tekrarlanabilir benchmark komutu sun.

## 7. Editor Verimliligi

061. Son degisen satirlari editor kenarinda sade bir zaman cizelgesiyle goruntule.
062. Kaydetmeden once yalniz degisen bolgeyi formatlama secenegi sun.
063. Birden cok dosyada ayni ismi guvenli yeniden adlandirmadan once etki ozeti goster.
064. Buyuk log dosyalari icin akici kuyruk izleme ve duraklatma modu ekle.
065. JSON, YAML ve TOML yapilandirmalari icin fark odakli karsilastirma gorunumu sun.
066. Projede sik acilan dosyalari yerel kullanimla tahmin eden hizli dosya paneli ekle.
067. Secili kod parcasi icin kalici olmayan, dosyayi degistirmeyen not katmani sun.
068. Hata mesajlarindan ilgili dosya ve satira tek tikla giden akilli terminal linkleri gelistir.
069. Kaydedilmemis coklu degisiklikleri adlandirilmis taslak olarak saklama ozelligi ekle.
070. Iki commit arasindaki degisen fonksiyonlara odaklanan okuma modu sun.

## 8. Git ve Kod Inceleme

071. Commit atmadan once secret, buyuk binary ve telemetry ayari bozulmasini kontrol eden yerel preflight ekle.
072. Branch degistirmeden once acik taslaklari guvenli saklama ve geri getirme akisi sun.
073. Merge conflict ekraninda her tarafin ilgili commit mesajini yaninda goster.
074. Staged dosyalar icin paket boyutu ve guvenlik etkisi rozeti ekle.
075. Degisiklikleri amacina gore gruplandiran manuel patch sepetleri sun.
076. Release branch icin zorunlu guvenlik kontrol listesini arayuzde takip edilebilir yap.
077. Imzali commit ve imzali tag durumunu SCM panelinde belirgin goster.
078. Offline ortamda hazirlanan commitleri sonradan guvenli push icin kuyruga al.
079. Hassas dosya desenleri icin `.gitignore` onerisini calisma alani acilisinda sun.
080. Kod incelemesinde test edilmemis degisiklikleri dosya bazinda isaretleyen rapor ekle.

## 9. Terminal ve Gorevler

081. Profil bazli terminal ortam degiskenlerini gozle gorulur ve duzenlenebilir yap.
082. Uzak sunucular icin salt okunur terminal modu ve gecici yazma acma dugmesi sun.
083. Komut gecmisindeki token benzeri degerleri otomatik maskeleyen yerel filtre ekle.
084. Sik calisan gorevleri CPU/RAM limiti ve zaman asimi ile baslatma secenegi sun.
085. Basarisiz build cikisindan ilgili hata satirlarini ayiklayan sorun paneli gelistir.
086. Bir gorevi tekrarlarken degisen dosyalarin listesini yaninda goster.
087. VDS profilinde terminal sayisi ve scrollback icin kullaniciya anlasilir limit kontrolleri sun.
088. Terminal cikisini sifreli yerel destek paketi olarak disa aktarma ozelligi ekle.
089. Komut calismadan once etkiledigi klasorleri gosteren guvenli gorev tanimi formati tasarla.
090. Ortam degiskenlerindeki gizli degerleri loglara dusurmeden gorev hata ayiklama modu sun.

## 10. Arama ve Buyuk Projeler

091. Mono-repo icin bolum bazli arama indeksleri olusturup ihtiyac halinde yukle.
092. VDS modunda indeks yerine dusuk bellekli akilli tarama secenegi sun.
093. Arama sonuclarinda binary, uretilmis ve vendor dosyalarini kolayca filtrele.
094. Gizli bilgi desenlerini arayan yerel `Guvenlik Aramasi` sablonlari ekle.
095. Son arama sorgularini proje bazinda saklayip profil aktariminda secilebilir yap.
096. Dosya turune gore arama kapsamlarini tek tikla secen preset'ler sun.
097. Replace islemlerinde once otomatik geri donus noktasi olustur.
098. Arama sonucundaki dosyalari sahiplik veya klasor katmanina gore grupla.
099. Cok buyuk sonucu akis halinde getirip arayuzun bellek kullanmasini sinirla.
100. Calisma alanindaki en buyuk dosya ve klasorleri editor icinden raporlayan komut ekle.

## 11. Uzak Calisma ve Baglanti

101. Uzak oturum icin baglanti gecikmesi, bant genisligi ve paket kaybi paneli sun.
102. Dusuk bant genisliginde otomatik olarak animasyon, webview ve gorsel onizlemeyi azalt.
103. Uzak dosya kaydetmelerinde baglanti kopmasina dayanikli yerel kuyruk mekanizmasi ekle.
104. Uzak ortam anahtarlarini sistem kimlik kasasinda tutup ayar dosyasina yazma.
105. Uzak calisma alanina baglanmadan once izinli klasor ve portlari onizlet.
106. Tunel acildiginda yerel ag erisimi riskini anlatan ve kapsami sinirlayan ayar sun.
107. Uzak oturum icin tek tikla tum port yonlendirmelerini durdurma butonu ekle.
108. Canli paylasim oturumunda hangi dosyalarin paylasildigini surekli gorunur yap.
109. Uzak makinenin RAM durumuna gore otomatik profil onerisi sun.
110. Baglanti bittiginde gecici token, terminal gecmisi ve cache'i secimli temizle.

## 12. Yedekleme ve Kurtarma

111. Kullanici ayarlari icin sifreli, yerel ve zaman damgali anlik goruntu sistemi ekle.
112. Profil degisikliklerinde once otomatik geri donus noktasi al.
113. Cokme sonrasi geri getirilen dosyalarin farkini kaydetmeden once goster.
114. Eklenti listesini ayarlardan ayri yedekleyerek pluginsiz profile temiz donusu kolaylastir.
115. Acil durum icin yalniz editor ve dosya kurtarma servisleriyle baslayan mod ekle.
116. Yedeklerde gizli anahtar algilanirsa dosyayi dahil etmeden kullaniciyi uyar.
117. Workspace bazli kurtarma politikasini kurumsal yonetim icin ayarlanabilir yap.
118. Installer guncellemesinden once kullanici profilini dogrulanan arsiv olarak sakla.
119. Hasarli ayar JSON dosyasini son saglam surumle onarabilen tanilama komutu ekle.
120. Yedekleme klasorunun disk kotasini ve saklama suresini profil bazinda belirle.

## 13. Erisilebilirlik ve Kullanilabilirlik

121. Dusuk gorus icin yuksek kontrast profili tek tikla etkinlestiren hizli secim ekle.
122. Ekran okuyucuda gereksiz panel hareketlerini azaltan sade gezinme modu sun.
123. Tum kritik gizlilik ve guvenlik durumlarini renk disinda metin ve ikonla da belirt.
124. Klavye ile profil, guvenlik ve performans panellerinin tum islemlerini yapilabilir kil.
125. Uzak masaustunde okunabilirlik icin net font render ve imlec kalinligi preset'i sun.
126. Uzun hata mesajlarini baslik, neden ve onerilen eylem olarak okunabilir bicimde bol.
127. Komut paletinde profil tarafindan kapatilan komutlar icin acik neden goster.
128. Yuksek gecikmeli baglantida buton cift tiklamalarini engelleyen islem durumu sun.
129. Renk temasi ile terminal temasinin kontrast uyumunu otomatik denetle.
130. Dil paketlerini offline kurabilmek icin imzali yerel dil paketi destegi sun.

## 14. Ayarlar ve Politika Yonetimi

131. Profil varsayilanlari, kullanici tercihleri ve kurum politikalarini uc sutunda karsilastir.
132. Telemetry kapatma gibi kilitli gizlilik ayarlarinin neden degistirilemedigini acikca goster.
133. Ayar degisikliginin hangi profil ve performans davranisini etkileyecegini belirt.
134. Guvenli ayar paketlerini QR veya kucuk JSON manifest ile offline aktar.
135. Hatali ayar kombinasyonlarini acilista tespit edip tek tikla duzeltme sun.
136. Sadece secili projede gecici ayar uygulayan ve kapanista temizlenen oturum modu ekle.
137. VDS icin tavsiye edilen ayarlardan sapmalari raporlayan `Profil Sagligi` ekrani ekle.
138. Kurumsal politikalar icin imzali ve salt okunur ayar katmani destekle.
139. Ayarlar aramasinda `RAM`, `gizlilik`, `eklenti` gibi amac odakli filtreler sun.
140. Ayar disa aktariminda kimlik bilgisi veya makine kimligi tasinmadigini otomatik test et.

## 15. Offline ve Kapali Ag Kullanimi

141. Internetsiz kurulum icin eklenti, tema ve dil paketlerini iceren imzali bundle formati olustur.
142. Kapali ag profilinde tum harici URL'leri engelleyip izinli yerel registry tanimla.
143. Offline yardim dokumani ve klavye kisayol aramasini uygulama icine dahil et.
144. Baglanti yokken guncelleme aramasi yerine yerel update paketi yukleme ekrani sun.
145. Kurum icinde dagitilan eklentilerin hash manifestini otomatik denetle.
146. Offline cihazdan hata raporu cikarirken kaynak kodu dahil etmeyen guvenli paket uret.
147. Lisans ve ucuncu taraf bildirimlerini internet olmadan goruntulenebilir tut.
148. Yerel ag proxy ve sertifika ayarlarini test eden baglanti tanilama komutu ekle.
149. Kapali ag modu etkinlestiginde marketplace ve giris komutlarini otomatik gizle.
150. Iki offline makine arasinda profil guncellemesini imzali USB paketiyle tasiyabil.

## 16. AI ve Yardimci Ozellikler

151. AI ozelliklerini sadece kullanici actiginda yuklenen, varsayilan kapali bir modul olarak paketle.
152. Yerel model calistirma secenegiyle kodun ag uzerinden cikmadigi bir sohbet modu sun.
153. Harici AI servisine gidecek baglami onceden gosteren ve duzenleten izin ekrani ekle.
154. Gizli anahtar veya kisisel veri algilanan secimleri AI isteginden otomatik cikart.
155. VDS profilinde AI servislerini yuklemeyerek bellek kazancini acikca raporla.
156. AI ile onerilen terminal komutlarini calistirmadan once risk sinifina gore isaretle.
157. Kod tamamlama icin dosya ve klasor bazli `asla gonderme` politikasi sun.
158. Yerel AI gunlugunu kapatma ve tek tikla temizleme kontrolleri ekle.
159. AI tarafindan degistirilen kodu ayri patch olarak incelemeden uygulamama akisi tasarla.
160. Kurum politikasi geregi AI kapaliysa butun AI yuzeylerini tamamen gizle.

## 17. Test, Kalite ve Tani

161. Her profil icin acilis, telemetry kapaliligi ve eklenti gorunurlugunu test eden smoke suite ekle.
162. VDS paketinde belirli bir RAM tavaninin asilmadigini olcen tekrarlanabilir performans testi kur.
163. Installer kurulum/kaldirma testini temiz Windows sanal makinelerinde otomatik calistir.
164. Guncelleme sonrasinda profil ayarlari ve veri klasoru adinin degismedigini dogrula.
165. Telemetry endpointine istek gitmedigini ag seviyesinde test eden entegrasyon testi ekle.
166. Eklentili pakette marketplace ulasilamazken editorun saglikli calistigini test et.
167. Pluginsiz pakette kullanici VSIX yuklemesi politikasini acik bir testle belgeleyip dogrula.
168. Bozuk ayar, bozuk extension ve dusuk disk senaryolari icin kurtarma testleri yaz.
169. Paket icindeki tum binary dosyalarin imza ve hash listesini CI'da dogrula.
170. Surum notuna otomatik olarak test edilen profil matrisini ekleyen rapor uret.

## 18. Release ve Bakim

171. Upstream VS Code tag'i ile TaxCode patch katmanini ayri tutan yeniden uygulanabilir update akisi kur.
172. Her upstream guncellemesinde degisen gizlilik ve eklenti kodunu otomatik listeleyen diff raporu uret.
173. Profil konfigurasyonlarini semali JSON ile validate ederek yanlis paket cikmasini engelle.
174. Installer dosya adina profil, surum ve mimariyi ekleyerek karisik dagitimi onle.
175. Yayinlanan her EXE yaninda SBOM, checksum ve imza dogrulama talimati sun.
176. Guvenlik duzeltmeleri icin normal ozellik surumunden bagimsiz hizli hotfix kanali tanimla.
177. EOL olan paketleri uygulama icinde acikca belirtip desteklenen profile gecis sun.
178. Upstream lisans ve ucuncu taraf bildirimlerini her build'de otomatik senkronize et.
179. Geri alma icin onceki iki guvenli installer'i yerel release arsivinde sakla.
180. Her release icin `hangi profil kime uygun` karar tablosu yayinla.

## 19. Kurumsal ve Ekip Ozellikleri

181. Takim yoneticisinin izinli profil ve eklenti listesini imzali politika ile dagitmasini sagla.
182. Paylasilan proje sablonlarinda gerekli eklentileri tavsiye ve zorunlu olarak ayir.
183. Hassas repolarda kopyalama, harici link ve AI kullanim politikasini merkezden uygula.
184. Uzak gelistirme sunucusunda kullanici basina RAM ve extension host kotasi koy.
185. Audit kayitlarini telemetry degil, sadece kurumun belirledigi yerel/SIEM hedefine opt-in gonder.
186. Destek masasi icin kisiyi tanimlamayan tanilama paketi olusturma sihirbazi sun.
187. Profilleri departman bazinda adlandirip logoda veya baslikta ayrim yapabilme secenegi ekle.
188. Kurum sertifika deposuyla imzali VSIX dogrulamasini entegre et.
189. Paylasimli makinelerde kapanista kullanici profili ve token temizleme politikasi ekle.
190. Lisansli veya yasak eklentileri kurulumdan once kontrol eden uyumluluk paneli sun.

## 20. Kullanici Degeri Yuksek Yenilikler

191. Bir projeyi ilk acista dil, boyut ve uzak calisma durumuna gore en uygun profil ile acmayi oner.
192. `Neden yavas?` komutuyla en pahali editor, eklenti ve dosya izleyici etkenlerini acikla.
193. `Gizli veri var mi?` komutuyla commit oncesi anahtar ve sertifika taramasi yap.
194. `Guvenli paylas` komutuyla log ve ayarlardan hassas alanlari temizleyerek destek arsivi uret.
195. `VDS'ye gec` komutuyla mevcut pencereyi hafif ayarlarla yeniden baslat.
196. `Eklentisiz dene` komutuyla ayni projeyi gecici temiz profilde acarak sorun ayiklamayi kolaylastir.
197. Kullaniciya profilinin bir surum guncellemesinde kazanacagi guvenlik ve performans faydasini ozetle.
198. Profil secimine gore kurulum boyutu, ilk acilis ve tipik RAM sonucunu gercek olcumlerle yayinla.
199. Guvenlik panelinde acik bulgulari `simdi duzelt`, `izle`, `uygulanamaz` olarak yonetilebilir yap.
200. TaxCode'un temel sozunu urun icinde denetlenebilir kil: telemetry kapali, profil acik, paket dogrulanabilir.
