/* SETTINGS */
// noinspection GrazieInspection

/*
   Settings are established by default to reset YouTube to look how it did just before the circular UI rework,
   leave all settings true to return to how it used to be, this changes shapes but also some other things such
   as colors and text.
*/


/*DISCLAIMER! At current state not all variables are used, functionally will be added as the project progresses*/
const           UN_ROUNDED_VIEWS = true; //Makes views squared like they were originally (still some missing), also includes fixed search box at this time.
const    UN_ROUNDED_LINK_WINDOWS = true; //Makes all video windows linked inside the video frame squared like they were originally.
const UN_ROUNDED_EXPANDING_HOVER = true; //Makes all website expanding link descriptions inside the video frame square like they were originally.
const               PROPER_DATES = true; //Changes main video date info from "<#> years/months/etc. ago" to it's formatted date
const     SUBSCRIBE_BUTTON_COLOR = true; //Changes subscribe button from white to the original red
const   SAVE_VISIBLE_BEFORE_CLIP = true; //Places save action before the clip action

/* Extras (Disabled by default) */
const SHOW_VIDEO_LENGTH_IN_NOTIFICATIONS = false;//Shows video length in notifications like it does in thumbnail views
const PERCENT_MORE_SPACE_TO_ACTIONS_BAR = 0;//+5 for adding one more option, for example, showing share, clip, and save instead of just share and clip

/* DEBUGGING */
const SHOW_CHANGES_BACKGROUNDS = false; //changes background color of all changed places to orange


//Created pages to inject
let style = document.createElement('style');
let script = document.createElement('script');
let activator = document.createElement('script');


//Element to hold injected items and insert within
let injectedDiv = document.createElement("div");


if(UN_ROUNDED_VIEWS){
    style.innerHTML = `
    /*THUMBNAILS*/
        #thumbnail{
            border-radius: 0 !important;
        }
        .ytp-videowall-still-round-medium .ytp-videowall-still-image{
            background-color: orange !important;
            border-radius: 0 !important;
        }
    /*SEARCH BOX (main)*/
        #container.ytd-searchbox {
            border-radius: 2px 0px 0px 2px  !important;
        }
        button#search-icon-legacy {
            border-radius: 0px 2px 2px 0px !important;
        }
    /*FEEDBACK BUTTONS (remove background line to get corners)*/
        [aria-label='Share'], [aria-label='Dislike this video'], [aria-label^='like this video along with '], [aria-label$=' likes'], [aria-label='Clip'], [aria-label='Save to playlist']{
            border-radius: 0px !important;
            background: none !important;
        }
        /*Popup Menus*/
            /*SAVE & SHARE*/
            .ytd-popup-container{
                border-radius: 0 !important;
            }
        
    /*SUBSCRIBE THINGS*/
        [aria-label^='Subscribe to ']{
            border-radius: 2px !important;
        `;
    if(SUBSCRIBE_BUTTON_COLOR){
        style.innerHTML += `
            color: var(--yt-spec-static-brand-white) !important;
            background-color: var(--yt-spec-brand-button-background) !important;/*Bring back the red instead of the white*/
        `;
    }
    style.innerHTML += `
        }
        [aria-label^='Unsubscribe from ']{
            border-radius: 2px !important;
        }
    /*PLAYLIST LIST*/
        .ytd-playlist-panel-renderer{
            border-radius: 0 !important;
        }
    /*MINIPLAYER*/
        video{ /*Also does the main but this should be more efficient*/
            border-radius: 0 !important;
        }
        /*When hovering layer*/
        .ytp-miniplayer-scrim{
            border-radius: 0 !important;
        }
    /*NOTIFICATIONS*/ /*Also taken care of under "Popup Menus"
        ytd-multi-page-menu-renderer{
            border-radius: 0 !important;
        }*/
            
        /*[data-layer="4"]{
            background-color: blue !important;
            background-color: red !important;
        }*/
    /*ANNOTATIONS*/
    /*PLAYER SETTINGS*/
        .ytp-settings-menu{
            border-radius: 0 !important;
        }
        
    `;
}

script.innerHTML = `
    function applyGeneratedScripts(){ 
        console.log("[ReturnYoutubeUI]: Activator call was received");
    `;


/* Video link windows inside the player that show up during playtime */
if(UN_ROUNDED_LINK_WINDOWS){
    script.innerHTML += `
        let windows = document.querySelectorAll('.ytp-ce-covering-overlay');

        for (let i = 0; i < windows.length; i++) {
            windows[i].parentElement.style.borderRadius = '0px';
        }

    `;
}

/* Website link windows inside the player that show up during playtime are square but when
 they expand after being hovered over, they expand to have rounded corners after the UI update,
 if this setting is true, then the corners will be removed to their orignal state. */
if(UN_ROUNDED_EXPANDING_HOVER){
    script.innerHTML += `
        let expandingDescriptions = document.querySelectorAll('.ytp-ce-expanding-overlay-background');
    
        for (let i = 0; i < expandingDescriptions.length; i++) {
            expandingDescriptions[i].parentElement.style.borderRadius = '0px';
            expandingDescriptions[i].style.borderRadius = 'inherit';//Allows it to also cover channel links which are not always caught
        }
    `;
}


/* Delay of # second*/ //Figure out how to make on load correctly


if(PROPER_DATES){
    script.innerHTML += `
        let elementsOfFirstRowInDetails = document.getElementsByClassName("style-scope yt-formatted-string bold");
        for(let i = 0; i < elementsOfFirstRowInDetails.length; i++){
            if(elementsOfFirstRowInDetails[i].innerText.endsWith("ago")){//If the element was the one that needs to be replaced with the formatted date
                elementsOfFirstRowInDetails[i].textContent = document.querySelectorAll("yt-formatted-string.style-scope.ytd-video-primary-info-renderer")[2].textContent;
            }
        }
    `;
}

if(SAVE_VISIBLE_BEFORE_CLIP){
    script.innerHTML += `
        // let flexActionElements = document.querySelectorAll('#flexible-item-buttons.style-scope.ytd-menu-renderer > ytd-button-renderer.style-scope.ytd-menu-renderer');
    
        let actionsRightOfDislike = document.querySelectorAll(".ytd-menu-renderer>ytd-button-renderer.style-scope.ytd-menu-renderer");
    
    
        let shareButton = null;
        let saveButton = null;
        let thanksButton = null;
        let clipButton = null;
        for (let i = 0; i < actionsRightOfDislike.length; i++){
            const actionRightOfDislike = actionsRightOfDislike[i].textContent;
            if(actionRightOfDislike.includes("Share")){
                if(!shareButton)
                    shareButton = actionsRightOfDislike[i];
            }else if(actionRightOfDislike.includes("Thanks")){
                if(!thanksButton)
                    thanksButton = actionsRightOfDislike[i];
            }else if(actionRightOfDislike.includes("Cli")){
                if(!clipButton)
                    clipButton = actionsRightOfDislike[i];
            }else if(actionRightOfDislike.includes("Save")){
                if(!saveButton)
                    saveButton = actionsRightOfDislike[i];
            }
    
    
        }
    
   
        /*Need to check to avoid error on null, checks all just for completeness and just
         in case something get changed by another extension or a different view setting*/
        if(saveButton && shareButton)
            actionsRightOfDislike[0].parentNode.insertBefore(saveButton, shareButton);//.parentNode.firstChild
        // if(!clipButton)
        // if(!thanksButton)
    
    
        // MOVE and not just  set
    `;
}


if(PERCENT_MORE_SPACE_TO_ACTIONS_BAR !== 0){
    script.innerHTML += `
        let elements3 = document.getElementById("actions");
        elements3.style.minWidth = "calc(5"+`+PERCENT_MORE_SPACE_TO_ACTIONS_BAR+`+"% - 6px)";
        elements3.style.marginLeft = "-"+`+PERCENT_MORE_SPACE_TO_ACTIONS_BAR+`+"%";
    `;
}

injectedDiv.appendChild(style);
injectedDiv.appendChild(script);

script.innerHTML+=` };`;

/* Run the scrips again that were added to the page using this as youtube switches videos
   in a way that makes it difficult to just see if the page url changes. This also means
   we do not need to worry about loosing the function we created between different pages. */
activator.innerHTML = `
    let video = document.getElementsByTagName('video')[0];
    let lastSrc = "-1";
    video.addEventListener('playing', function() {
        if(video.src !== lastSrc){
            lastSrc = video.src;
    
            applyGeneratedScripts();
        }
    });
`;



document.body.appendChild(injectedDiv);
document.body.appendChild(activator);

