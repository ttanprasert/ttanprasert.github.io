var area00 = {x1:45, y1:114, x2:55, y2:128, startTime:505, endTime:507, color:'c'};
var area01 = {x1:60, y1:114, x2:68, y2:128, startTime:507, endTime:510, color:'c'};
var area02 = {x1:73, y1:114, x2:99, y2:128, startTime:510, endTime:512, color:'c'};
var area03 = {x1:106, y1:114, x2:115, y2:128, startTime:512, endTime:515, color:'c'};
var area04 = {x1:119, y1:114, x2:129, y2:128, startTime:515, endTime:517, color:'c'};
var area05 = {x1:132, y1:114, x2:146, y2:128, startTime:517, endTime:520, color:'c'};
var area10 = {x1:14, y1:190, x2:32, y2:208, startTime:520, endTime:522, color:'c'};
var area11 = {x1:69, y1:190, x2:82, y2:208, startTime:522, endTime:524, color:'c'};
var area12 = {x1:116, y1:190, x2:149, y2:208, startTime:524, endTime:526, color:'c'};
var area13 = {x1:206, y1:190, x2:225, y2:208, startTime:526, endTime:529, color:'c'};
var area20 = {x1:16, y1:228, x2:42, y2:238, startTime:529, endTime:531, color:'c'};
var area21 = {x1:85, y1:228, x2:109, y2:238, startTime:531, endTime:533, color:'c'};
var area22 = {x1:134, y1:228, x2:166, y2:238, startTime:533, endTime:535, color:'c'};
var area23 = {x1:188, y1:228, x2:221, y2:238, startTime:535, endTime:537, color:'c'};
var area24 = {x1:242, y1:228, x2:264, y2:238, startTime:537, endTime:545, color:'c'};
var area30 = {x1:15, y1:270, x2:37, y2:264, startTime:545, endTime:547, color:'c'};
var area31 = {x1:94, y1:270, x2:124, y2:264, startTime:547, endTime:550, color:'c'};
var area32 = {x1:151, y1:270, x2:166, y2:264, startTime:550, endTime:568, color:'c'};
var area50 = {x1:15, y1:364, x2:37, y2:385, startTime:838, endTime:843, color:'c'};
var area51 = {x1:146, y1:364, x2:171, y2:385, startTime:843, endTime:846, color:'c'};
var area52 = {x1:217, y1:364, x2:235, y2:385, startTime:846, endTime:849, color:'c'};
var area60 = {x1:82, y1:410, x2:99, y2:415, startTime:849, endTime:852, color:'c'};
var area61 = {x1:124, y1:410, x2:151, y2:415, startTime:852, endTime:854, color:'c'};
var area62 = {x1:224, y1:410, x2:246, y2:415, startTime:854, endTime:856, color:'c'};
var area63 = {x1:256, y1:410, x2:281, y2:415, startTime:856, endTime:858, color:'c'};
var area70 = {x1:68, y1:450, x2:93, y2:465, startTime:858, endTime:860, color:'c'};
var area71 = {x1:107, y1:450, x2:130, y2:465, startTime:860, endTime:862, color:'c'};
var area72 = {x1:175, y1:450, x2:186, y2:465, startTime:862, endTime:864, color:'c'};
var area73 = {x1:209, y1:450, x2:231, y2:465, startTime:864, endTime:873, color:'c'};
var area80 = {x1:17, y1:482, x2:30, y2:494, startTime:873, endTime:875, color:'c'};
var area81 = {x1:73, y1:482, x2:94, y2:494, startTime:875, endTime:876, color:'c'};
var area82 = {x1:154, y1:482, x2:173, y2:494, startTime:876, endTime:879, color:'c'};
var area83 = {x1:232, y1:482, x2:247, y2:494, startTime:879, endTime:882, color:'c'};

var areaList = [area00, area01, area02, area03, area04, area05,
                area10, area11, area12, area13, area20, area21, area22, area23, area24, area30, area31, area32, 
                area50, area51, area52, area60, area61, area62, area63, area70, area71, area72, area73, area80, area81, area82, area83];

function getArea(i) {
    return areaList[i];
};

function getHeight(i) {
    if (i < 6) {
        return 114;
    }
    else if (i < 10) {
        return 190;
    }
    else if (i < 15) {
        return 228;
    }
    else if (i < 18) {
        return 270;
    }
    else if (i < 21) {
        return 370;
    }
    else if (i < 25) {
        return 412;
    }
    else if (i < 29) {
        return 450;
    }
    else {
        return 490;
    }
};

function changeAreaColor(i, c) {
    areaList[i].color = c;
};

function getNumArea(){
    return areaList.length;
};