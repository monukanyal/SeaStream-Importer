
// This will make our lives easier in Lectus so we do not have to rename files
// This should remove all the unwanted stuff and leave us with just the title


/* Constants */
var YEAR_REGEX = /(19|20)\d{2}/g;
var CD_NUMBER_REGEX = /cd(\s?)[1-9]/gi;

/* Public Methods */

/**
 * Cleans up the specified title
 * @param title            The title to clean
 * @returns {{title: string, year: string, cd: string}}
 */
exports.cleanupTitle = function(title) {
	// Cleanup Movie Title
	var cleanTitle = title;
	cleanTitle = stripIllegalCharacters(cleanTitle, ' ');
	cleanTitle = removeYearFromTitle(cleanTitle);	
	cleanTitle = removeReleaseGroupNamesFromTitle(cleanTitle);
	cleanTitle = removeMovieTypeFromTitle(cleanTitle);
	cleanTitle = removeAudioTypesFromTitle(cleanTitle);	
	cleanTitle = removeCountryNamesFromTitle(cleanTitle);	
	cleanTitle = removeCdNumberFromTitle(cleanTitle).trim();	

	// Extract CD-Number from Title
	var hasCdinTitle = title.match(CD_NUMBER_REGEX);
	var cd_number = hasCdinTitle ? hasCdinTitle.toString() : '';

	// Extract Year from Title
	var year = title.match(YEAR_REGEX);
	year = year ? year.toString() : '';	

	return { title: cleanTitle, year: year, cd: cd_number };
};

/* Private Method */

stripIllegalCharacters = function(movieTitle, replacementString) {
	return movieTitle.replace(/\.|_|\/|\+|\-/g, replacementString);
};

removeYearFromTitle = function(movieTitle) {
	return movieTitle.replace(YEAR_REGEX, "").replace(/\(|\)/g,'');
};

removeReleaseGroupNamesFromTitle = function(movieTitle) {
	return movieTitle.replace(
		/FxM|aAF|arc|AAC|MLR|AFO|TBFA|WB|YIF|GAZ|BADASSMEDIA|JYK|HI|ARAXIAL|WEBRip|AMIABLE|iNTENSO|HDC|UNiVERSAL|ETRG|ToZoon|PFa|VETO|GHOULS|AiHD|CULTHD|TrollHD|MUxHD|PussyFoot|DOCUMENT|W4F|USURY|VoMiT|SiRiUS|Rets|BestDivX|Ltu|DIMENSION|PROPER|SADPANDA|CTU|BiPOLAR|FGT|ORENJI|WiKi|Replica|LOL|juggs|NeDiVx|ESPiSE|MiLLENiUM|iMMORTALS|QiM|QuidaM|COCAiN|DOMiNO|JBW|LRC|WPi|NTi|SiNK|CiNEFiLE|REGRET|HLS|HNR|iKA|LPD|DMT|DvF|IMBT|LMG|DiAMOND|DoNE|D0PE|NEPTUNE|TC|SAPHiRE|PUKKA|FiCO|PAL|aXXo|VoMiT|ViTE|ALLiANCE|mVs|XanaX|FLAiTE|PREVAiL|FGT|CAMERA|VH-PROD|BrG|replica|FZERO|YIFY|YTS.AG|MarGe|RARBG|ELiTE|T4P3|MIRCrew|SHUTTERSHIT|BOKUTOX|NAHOM|BLUWORLD|C0P|TRL/g,
		"");
};

removeMovieTypeFromTitle = function(movieTitle) {
	return movieTitle.replace(
		/dvdrip|multi9|xxx|x264|x265|AC3|web|hdtv|vhs|HC|embeded|5.1|embedded|ac3|dd5 1|m sub|x264|dvd5|dvd9|multi sub|non|h264|x264| sub|subs|ntsc|ingebakken|torrent|torrentz|bluray|brrip|sample|xvid|cam|camrip|wp|workprint|telecine|ppv|ppvrip|scr|screener|dvdscr|bdscr|ddc|R5|telesync|pdvd|1080p|BDRIP|hq|sd|720p|hdrip/gi,
		"");
};

removeAudioTypesFromTitle = function(movieTitle) {
	return movieTitle.replace(
		/320kbps|192kbps|128kbps|mp3|mp4|320|192|128/gi,
		"");
};

removeCountryNamesFromTitle = function(movieTitle) {
	return movieTitle.replace(
		/\b(NL|SWE|SWESUB|ENG|JAP|BRAZIL|TURKIC|slavic|SLK|ITA|HEBREW|HEB|ESP|RUS|DE|german|french|FR|ESPA|dansk|HUN|iTALiAN|JPN|[Ii]ta|[Ee]ng)\b/g,
		"");
};

removeCdNumberFromTitle = function(movieTitle) {
	return movieTitle.replace(CD_NUMBER_REGEX, "");
};