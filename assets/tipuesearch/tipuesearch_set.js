
/*
Tipue Search 6.0
Copyright (c) 2017 Tipue
Tipue Search is released under the MIT License
http://www.tipue.com/search
*/

var tipuesearch_pages = ["http://gnss-sdr.org/", "http://gnss-sdr.org/about/", "http://gnss-sdr.org/docs/sp-blocks/", "http://gnss-sdr.org/design-forces/accuracy/", "http://gnss-sdr.org/design-forces/availability/", "http://gnss-sdr.org/design-forces/efficiency/", "http://gnss-sdr.org/design-forces/flexibility/", "http://gnss-sdr.org/design-forces/interoperability/", "http://gnss-sdr.org/design-forces/maintainability", "http://gnss-sdr.org/design-forces/marketability/", "http://gnss-sdr.org/design-forces/portability/", "http://gnss-sdr.org/design-forces/popularity/", "http://gnss-sdr.org/design-forces/reliability/", "http://gnss-sdr.org/design-forces/repeatability/", "http://gnss-sdr.org/design-forces/reproducibility/", "http://gnss-sdr.org/design-forces/scalability/", "http://gnss-sdr.org/design-forces/testability/", "http://gnss-sdr.org/design-forces/openness/", "http://gnss-sdr.org/design-forces/usability/", "http://gnss-sdr.org/docs/", "http://gnss-sdr.org/docs/overview/", "http://gnss-sdr.org/docs/fundamentals/", "http://gnss-sdr.org/docs/control-plane/", "http://gnss-sdr.org/design-forces/", "http://gnss-sdr.org/contribute/", "http://gnss-sdr.org/coding-style/", "http://gnss-sdr.org/code-of-conduct/", "http://gnss-sdr.org/first-positioning-fix-using-galileo/", "http://gnss-sdr.org/google-summer-code-2013-ideas-list/", "http://gnss-sdr.org/esa-summer-code-space-2013-ideas-list/", "http://gnss-sdr.org/how-profile-code/", "http://gnss-sdr.org/google-summer-code-2014-ideas-list/", "http://gnss-sdr.org/esa-summer-code-space-2014-ideas-list/", "http://gnss-sdr.org/google-summer-code-2015-ideas-list/", "http://gnss-sdr.org/esa-summer-code-space-2015-ideas-list/", "http://gnss-sdr.org/", "http://gnss-sdr.org/google-summer-code-2016-ideas-list/", "http://gnss-sdr.org/docs/tutorials/gnss-sdr-operation-realtek-rtl2832u-usb-dongle-dvb-t-receiver/", "http://gnss-sdr.org/docs/tutorials/using-git/", "http://gnss-sdr.org//docs/tutorials/understanding-data-types/", "http://gnss-sdr.org/docs/tutorials/gnss-signals/", "http://gnss-sdr.org/docs/tutorials/cross-compiling/", "http://gnss-sdr.org/google-summer-code-2017-ideas-list/", "http://gnss-sdr.org/docs/tutorials/configuration-options-building-time/", "http://gnss-sdr.org/quick-start-guide/", "http://gnss-sdr.org/requirements/", "http://gnss-sdr.org/build-and-install/", "http://gnss-sdr.org/my-first-fix/", "http://gnss-sdr.org/conf/", "http://gnss-sdr.org/docs/sp-blocks/signal-source/", "http://gnss-sdr.org/docs/sp-blocks/signal-conditioner/", "http://gnss-sdr.org/docs/sp-blocks/data-type-adapter/", "http://gnss-sdr.org/docs/sp-blocks/input-filter/", "http://gnss-sdr.org/docs/sp-blocks/resampler/", "http://gnss-sdr.org/docs/sp-blocks/channels/", "http://gnss-sdr.org/docs/sp-blocks/acquisition/", "http://gnss-sdr.org/docs/sp-blocks/tracking/", "http://gnss-sdr.org/docs/sp-blocks/telemetry-decoder/", "http://gnss-sdr.org/docs/sp-blocks/observables/", "http://gnss-sdr.org/docs/sp-blocks/pvt/", "http://gnss-sdr.org/acks/", "http://gnss-sdr.org/geniuss-place/", "http://gnss-sdr.org/publications/", "http://gnss-sdr.org/team/", "http://gnss-sdr.org/docs/tutorials/"];

/*
Stop words
Stop words list from http://www.ranks.nl/stopwords
*/

var tipuesearch_stop_words = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"];


// Word replace

var tipuesearch_replace = {'words': [
     {'word': 'gnus', 'replace_with': 'gnss'},
     {'word': 'javscript', 'replace_with': 'javascript'},
     {'word': 'jqeury', 'replace_with': 'jquery'}
]};


// Weighting

var tipuesearch_weight = {'weight': [
     {'url': 'http://gnss-sdr/docs/sp_blocks/', 'score': 20},
     {'url': 'http://gnss-sdr/design-forces/', 'score': 30},
     {'url': 'http://gnss-sdr/docs/tutorials/', 'score': 10}
]};


// Illogical stemming

var tipuesearch_stem = {'words': [
     {'word': 'e-mail', 'stem': 'email'},
     {'word': 'javascript', 'stem': 'jquery'},
     {'word': 'javascript', 'stem': 'js'}
]};


// Related searches

var tipuesearch_related = {'searches': [
     {'search': 'tipue', 'related': 'Tipue Search'},
     {'search': 'tipue', 'before': 'Tipue Search', 'related': 'Getting Started'},
     {'search': 'tipue', 'before': 'Tipue', 'related': 'jQuery'},
     {'search': 'tipue', 'before': 'Tipue', 'related': 'Blog'}
]};


// Internal strings

var tipuesearch_string_1 = 'No title';
var tipuesearch_string_2 = 'Showing results for';
var tipuesearch_string_3 = 'Search instead for';
var tipuesearch_string_4 = '1 result';
var tipuesearch_string_5 = 'results';
var tipuesearch_string_6 = 'Back';
var tipuesearch_string_7 = 'More';
var tipuesearch_string_8 = 'Nothing found.';
var tipuesearch_string_9 = 'Common words are largely ignored.';
var tipuesearch_string_10 = 'Search too short';
var tipuesearch_string_11 = 'Should be one character or more.';
var tipuesearch_string_12 = 'Should be';
var tipuesearch_string_13 = 'characters or more.';
var tipuesearch_string_14 = 'seconds';
var tipuesearch_string_15 = 'Searches related to';


// Internals


// Timer for showTime

var startTimer = new Date().getTime();
