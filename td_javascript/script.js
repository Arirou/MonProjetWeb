// script.js
// Tous les comportements demandés sont implémentés ici.

const RATES = { eur_to_usd: 1.01, eur_to_aud: 1.47 }; // taux de change EUR->USD/AUD
function fmt(n){ return (Math.round(n*100)/100).toFixed(2); }

document.addEventListener('DOMContentLoaded', () => {

    /* ---------------------------
       Convertisseur v1 : bouton Euros -> USD/AUD
       --------------------------- */
    const euro1 = document.getElementById('euro1');
    const usd1 = document.getElementById('usd1');
    const aud1 = document.getElementById('aud1');
    const btnConvert1 = document.getElementById('convertir1');

    function convertV1(){
        const e = parseFloat(euro1.value) || 0;
        usd1.value = fmt(e * RATES.eur_to_usd);
        aud1.value = fmt(e * RATES.eur_to_aud);
    }

    convertV1();
    btnConvert1.addEventListener('click', convertV1);

    /* ---------------------------
       Convertisseur v2 : champ réactif
       --------------------------- */
    const euro2 = document.getElementById('euro2');
    const usd2 = document.getElementById('usd2');
    const aud2 = document.getElementById('aud2');

    const usd_per_eur = RATES.eur_to_usd;
    const aud_per_eur = RATES.eur_to_aud;
    const eur_per_usd = 1 / usd_per_eur;
    const eur_per_aud = 1 / aud_per_eur;

    let lock = false;

    function fromEuroToOthers(){
        if(lock) return; lock = true;
        const e = parseFloat(euro2.value) || 0;
        usd2.value = fmt(e * usd_per_eur);
        aud2.value = fmt(e * aud_per_eur);
        lock = false;
    }

    function fromUsd(){
        if(lock) return; lock = true;
        const e = (parseFloat(usd2.value) || 0) * eur_per_usd;
        euro2.value = fmt(e);
        aud2.value = fmt(e * aud_per_eur);
        lock = false;
    }

    function fromAud(){
        if(lock) return; lock = true;
        const e = (parseFloat(aud2.value) || 0) * eur_per_aud;
        euro2.value = fmt(e);
        usd2.value = fmt(e * usd_per_eur);
        lock = false;
    }

    euro2.value = 33;
    fromEuroToOthers();

    euro2.addEventListener('input', fromEuroToOthers);
    usd2.addEventListener('input', fromUsd);
    aud2.addEventListener('input', fromAud);

    /* ---------------------------
       Formulaire : lien Wikipedia + Vérification Oui/Non
       --------------------------- */
    const wikiLink = document.querySelector('#wikipediaLink');
    wikiLink.href = 'https://fr.wikipedia.org/wiki/Wikip%C3%A9dia:Accueil_principal';
    wikiLink.textContent = 'La page principale de Wikipedia (FR)';

    const inputOuiNon = document.getElementById('ouiNonInput');
    const checkBtn = document.getElementById('checkOuiNon');
    const feedbackDiv = document.getElementById('ouiNonFeedback');

    checkBtn.addEventListener('click', () => {
        const txt = (inputOuiNon.value || '').trim();
        if(txt === 'Oui' || txt === 'Non'){
            feedbackDiv.textContent = 'Valeur OK';
            feedbackDiv.style.color = 'green';
        } else {
            feedbackDiv.textContent = 'Il faut mettre Oui ou Non';
            feedbackDiv.style.color = 'red';
            inputOuiNon.placeholder = 'Il faut mettre Oui ou Non';
        }
    });

    /* ---------------------------
       Radios : modifier les labels
       --------------------------- */
    const radios = document.querySelectorAll('input[name="choix"]');
    const newLabels = ['HP', 'Casque', 'Bluetooth'];
    radios.forEach((r, idx) => {
        const parentLabel = r.parentNode;
        Array.from(parentLabel.childNodes).forEach(node => {
            if(node.nodeType === Node.TEXT_NODE) parentLabel.removeChild(node);
        });
        parentLabel.appendChild(document.createTextNode(' ' + newLabels[idx]));
        parentLabel.id = 'label_choice_' + (idx+1);
    });

    /* ---------------------------
       Changer le label volume selon choix radio
       --------------------------- */
    const volumeLabel = document.getElementById('volumeLabel');
    function onChoiceChange(){
        const checked = document.querySelector('input[name="choix"]:checked');
        if(!checked) return;
        const map = { '1': 'Volume HP', '2': 'Volume Casque', '3': 'Volume Bluetooth' };
        volumeLabel.textContent = map[checked.value];
    }
    radios.forEach(r => r.addEventListener('change', onChoiceChange));
    onChoiceChange();

    /* ---------------------------
       Slider : max=100, affichage valeur
       --------------------------- */
    const volume = document.getElementById('volume');
    const volumeValue = document.getElementById('volumeValue');
    volume.max = 100; console.log('volume max =', volume.max);
    volume.addEventListener('input', function(){
        volumeValue.textContent = this.value;
        console.log('Volume actuel =', this.value);
    });
    volumeValue.textContent = volume.value;

    /* ---------------------------
       Checkbox Mute : désactive volume
       --------------------------- */
    const muteCheckbox = document.getElementById('muteCheckbox');
    (function relabelMute(){
        const labels = document.querySelectorAll('label');
        labels.forEach(lbl => {
            if(lbl.contains(muteCheckbox)){
                Array.from(lbl.childNodes).forEach(node => {
                    if(node.nodeType === Node.TEXT_NODE) lbl.removeChild(node);
                });
                lbl.appendChild(document.createTextNode(' Mute'));
            }
        });
    })();

    muteCheckbox.addEventListener('change', function(){
        volume.disabled = this.checked;
    });

    /* ---------------------------
       Ajouter une image à la section Lien et images
       --------------------------- */
    (function appendExtraImage(){
        const linkImagesDiv = document.getElementById('linkImages');
        if(linkImagesDiv){
            const newImg = document.createElement('img');
            newImg.src = 'https://upload.wikimedia.org/wikipedia/commons/b/bd/UPHF_logo.svg';
            newImg.alt = 'UPHF logo';
            newImg.width = 200;
            newImg.style.display = 'block';
            newImg.style.marginTop = '10px';
            linkImagesDiv.appendChild(newImg);
        }
    })();

    /* ---------------------------
       Gestion des sections via menu
       --------------------------- */
    const convertSection = document.getElementById('convertSection');
    const formSection = document.getElementById('formSection');
    const progressSection = document.getElementById('progressSection');

    function hideAllPanels(){
        convertSection.style.display = 'none';
        formSection.style.display = 'none';
    }

    document.getElementById('showConvert').checked = false;
    document.getElementById('showForm').checked = false;
    document.getElementById('showProgress').checked = false;
    radios.forEach(r => r.checked = false);
    muteCheckbox.checked = false;
    volume.disabled = false;
    volume.value = 0; volumeValue.textContent = volume.value;
    volumeLabel.textContent = 'Volume';
    hideAllPanels();

    document.getElementById('showConvert').addEventListener('change', function(){
        convertSection.style.display = this.checked ? 'block' : 'none';
    });
    document.getElementById('showForm').addEventListener('change', function(){
        formSection.style.display = this.checked ? 'block' : 'none';
    });
    document.getElementById('showProgress').addEventListener('change', function(){
        progressSection.style.display = this.checked ? 'block' : 'none';
    });

    /* ---------------------------
       Date : log année choisie
       --------------------------- */
    const theDate = document.getElementById('theDate');
    theDate.addEventListener('change', function(){
        if(this.value) console.log('Année choisie =', this.value.split('-')[0]);
    });

    /* ---------------------------
       Progress bars : +5% toutes les secondes
       --------------------------- */
    const downloadProgress = document.getElementById('downloadProgress');
    const spaceProgress = document.getElementById('spaceProgress');
    downloadProgress.value = 0; spaceProgress.value = 0;

    let progInterval = setInterval(() => {
        [downloadProgress, spaceProgress].forEach(p => {
            let v = Number(p.value) || 0;
            if(v < 100) p.value = Math.min(100, v + 5);
        });
        if(downloadProgress.value >= 100 && spaceProgress.value >= 100) clearInterval(progInterval);
    }, 1000);

    /* ---------------------------
       UX : formatage initial des champs convertisseur v2
       --------------------------- */
    [euro2, usd2, aud2].forEach(el => {
        el.placeholder = '0.00';
        el.addEventListener('blur', function(){
            this.value = fmt(parseFloat(this.value) || 0);
        });
    });

    usd1.value = fmt(parseFloat(usd1.value) || (parseFloat(euro1.value || 0) * RATES.eur_to_usd));
    aud1.value = fmt(parseFloat(aud1.value) || (parseFloat(euro1.value || 0) * RATES.eur_to_aud));

});
