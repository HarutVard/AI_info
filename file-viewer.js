/**
 * file-viewer.js
 * ----------------
 * Բացում է ուսումնական նյութերը (PDF, PPTX, DOCX, IPYNB) նոր tab-ում՝
 * ուղիղ դիտման համար, փոխանակ դրանք ուղղակի ներբեռնելու։
 *
 * ⚠️ ԿԱՐԵՎՈՐ. Սա աշխատում է միայն այն դեպքում, երբ կայքը հրապարակված է
 * հանրային hosting-ի վրա (GitHub Pages, Netlify, և այլն) — ոչ թե տեղական
 * համակարգչից բացված (file:///...) կամ localhost-ից, քանի որ Office-ի և
 * Colab-ի viewer-ները պետք է կարողանան ինքնուրույն ներբեռնել ֆայլը
 * ինտերնետից՝ նրա հանրային հասցեով։
 *
 * ԱՆՀՐԱԺԵՇՏ ԿԱՐԳԱՎՈՐՈՒՄ .ipynb ֆայլերի համար.
 * Google Colab-ը կարող է ֆայլեր բացել միայն GitHub-ից՝ ուղիղ URL-ով
 * ֆայլից (ոչ թե ցանկացած hosting-ից)։ Այդ պատճառով անհրաժեշտ է ներքևում
 * լրացնել GITHUB_REPO-ն, եթե այս կայքի կոդը տեղադրված է GitHub-ում
 * (օրինակ՝ GitHub Pages-ի միջոցով)։
 */

const GITHUB_REPO = ""; // օր.՝ "harutyun/ab-hosq-site"  (username/repo-anun)
const GITHUB_BRANCH = "main"; // կամ "master", ինչ branch որ օգտագործում ես

function openMaterial(relPath) {
  const ext = relPath.split(".").pop().toLowerCase();
  const absoluteUrl = new URL(relPath, window.location.href).href;
  const isLocal =
    window.location.protocol === "file:" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (ext === "pptx" || ext === "docx" || ext === "doc" || ext === "xlsx" || ext === "ppt") {
    if (isLocal) {
      alert(
        "PPTX/DOCX ֆայլերը դիտելու համար (առանց ներբեռնելու) կայքը պետք է լինի հրապարակված (GitHub Pages, Netlify և այլն)։ Այժմ ֆայլը կբացվի/կներբեռնվի ուղղակիորեն։"
      );
      window.open(absoluteUrl, "_blank");
      return;
    }
    window.open(
      "https://view.officeapps.live.com/op/view.aspx?src=" + encodeURIComponent(absoluteUrl),
      "_blank"
    );
    return;
  }

  if (ext === "ipynb") {
    if (!GITHUB_REPO) {
      alert(
        "Colab-ում ipynb ֆայլը բացելու համար պետք է լրացնես GITHUB_REPO փոփոխականը file-viewer.js ֆայլում (քո GitHub username/repo-ն)։ Առայժմ ֆայլը կներբեռնվի ուղղակիորեն։"
      );
      window.open(absoluteUrl, "_blank");
      return;
    }
    window.open(
      `https://colab.research.google.com/github/${GITHUB_REPO}/blob/${GITHUB_BRANCH}/${relPath}`,
      "_blank"
    );
    return;
  }

  // PDF և մյուս տեսակները. բրաուզերն արդեն գիտի ինչպես ցուցադրել դրանք tab-ում
  window.open(absoluteUrl, "_blank");
}
