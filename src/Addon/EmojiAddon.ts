/// <reference path="../Renderer/InlineRenderer.ts" />

declare var twemoji : {parse(text:string, ...args:any[]):string};

namespace MarkdownIME.Addon {
	/**
	 * EmojiAddon is an add-on for InlineRenderer, translating `8-)` into ![😎](https://twemoji.maxcdn.com/36x36/1f60e.png)
	 * Part of the code comes from `markdown-it/markdown-it-emoji`
	 * 
	 * @see https://github.com/markdown-it/markdown-it-emoji/
	 */
	export class EmojiAddon implements MarkdownIME.Renderer.IInlineRule {

		name = "Emoji";

		use_shortcuts: boolean = true;
		
		/** use twemoji to get `img` tags if possible. if it bothers, disable it. */
		use_twemoji: boolean = true;
		twemoji_config = {};
		
		render(tree: DomChaos){
			var text = tree.text
			
			text = text.replace(this.full_syntax, this.magic1.bind(this));
			if (this.use_shortcuts) {
				text = this.magic2(text);
			}
			tree.text = text;
			
			if (this.use_twemoji && typeof twemoji != "undefined") {
				var html = tree.getHTML();
				var html2 = twemoji.parse(html, this.twemoji_config);
				if (html !== html2) tree.setHTML(html2);
			}
		}
		
		unrender(tree: DomChaos){}

		full_syntax = /:(\w+):/g;
		
		/** magic1 translates `:name:` into proper emoji char */
		magic1(fulltext: string, name: string): string {
			return this.chars[name] || fulltext;
		}
		
		/** magic2 proccess shortcuts for all emojis */
		magic2(text: string) {
			if (!this.shortcuts_cache.length) this.UpdateShortcutCache();
			for (let i = this.shortcuts_cache.length - 1; i >= 0; i--) {
				text = text.replace(
					this.shortcuts_cache[i].regexp,
					this.chars[this.shortcuts_cache[i].targetName]
				);
			}
			return text;
		}
		
		/** shortcuts RegExp cache. Order: [shortest, ..., longest] */
		shortcuts_cache: { regexp: RegExp, length: number, targetName: string }[] = [];
		
		/** update the shortcuts RegExp cache. Run this after modifing the shortcuts! */
		UpdateShortcutCache() {
			this.shortcuts_cache = [];
			for (let name in this.shortcuts) {
				let shortcut_phrases: RegExp[] | string[] = this.shortcuts[name];
				for (let s_i = shortcut_phrases.length - 1; s_i >= 0; s_i--) {
					let regex = shortcut_phrases[s_i];
					if (!(regex instanceof RegExp)) {
						regex = new RegExp(Utils.text2regex(<string>regex), "g");
					}
					this.shortcuts_cache.push({
						regexp: <RegExp>regex,
						length: regex.toString().length,
						targetName: name
					});
				}
			}
			this.shortcuts_cache.sort((a, b) => (a.length - b.length))
		}

		chars = {
			"smile": "😄",
			"smiley": "😃",
			"grinning": "😀",
			"blush": "😊",
			"wink": "😉",
			"heart_eyes": "😍",
			"kissing_heart": "😘",
			"kissing_closed_eyes": "😚",
			"kissing": "😗",
			"kissing_smiling_eyes": "😙",
			"stuck_out_tongue_winking_eye": "😜",
			"stuck_out_tongue_closed_eyes": "😝",
			"stuck_out_tongue": "😛",
			"flushed": "😳",
			"grin": "😁",
			"pensive": "😔",
			"relieved": "😌",
			"unamused": "😒",
			"disappointed": "😞",
			"persevere": "😣",
			"cry": "😢",
			"joy": "😂",
			"sob": "😭",
			"sleepy": "😪",
			"disappointed_relieved": "😥",
			"cold_sweat": "😰",
			"sweat_smile": "😅",
			"sweat": "😓",
			"weary": "😩",
			"tired_face": "😫",
			"fearful": "😨",
			"scream": "😱",
			"angry": "😠",
			"rage": "😡",
			"confounded": "😖",
			"laughing": "😆",
			"satisfied": "😆",
			"yum": "😋",
			"mask": "😷",
			"sunglasses": "😎",
			"sleeping": "😴",
			"dizzy_face": "😵",
			"astonished": "😲",
			"worried": "😟",
			"frowning": "😦",
			"anguished": "😧",
			"imp": "👿",
			"smiling_imp": "😈",
			"open_mouth": "😮",
			"neutral_face": "😐",
			"confused": "😕",
			"hushed": "😯",
			"no_mouth": "😶",
			"innocent": "😇",
			"smirk": "😏",
			"expressionless": "😑",
			"smiley_cat": "😺",
			"smile_cat": "😸",
			"heart_eyes_cat": "😻",
			"kissing_cat": "😽",
			"smirk_cat": "😼",
			"scream_cat": "🙀",
			"crying_cat_face": "😿",
			"joy_cat": "😹",
			"pouting_cat": "😾",
			"heart": "❤️",
			"broken_heart": "💔",
			"two_hearts": "💕",
			"sparkles": "✨",
			"fist": "✊",
			"hand": "✋",
			"raised_hand": "✋",
			"cat": "🐱",
			"mouse": "🐭",
			"cow": "🐮",
			"monkey_face": "🐵",
			"star": "⭐",
			"zap": "⚡",
			"umbrella": "☔",
			"hourglass": "⌛",
			"watch": "⌚",
			"black_joker": "🃏",
			"mahjong": "🀄",
			"coffee": "☕",
			"anchor": "⚓",
			"wheelchair": "♿",
			"negative_squared_cross_mark": "❎",
			"white_check_mark": "✅",
			"loop": "➿",
			"aries": "♈",
			"taurus": "♉",
			"gemini": "♊",
			"cancer": "♋",
			"leo": "♌",
			"virgo": "♍",
			"libra": "♎",
			"scorpius": "♏",
			"sagittarius": "♐",
			"capricorn": "♑",
			"aquarius": "♒",
			"pisces": "♓",
			"x": "❌",
			"exclamation": "❗",
			"heavy_exclamation_mark": "❗",
			"question": "❓",
			"grey_exclamation": "❕",
			"grey_question": "❔",
			"heavy_plus_sign": "➕",
			"heavy_minus_sign": "➖",
			"heavy_division_sign": "➗",
			"curly_loop": "➰",
			"black_medium_small_square": "◾",
			"white_medium_small_square": "◽",
			"black_circle": "⚫",
			"white_circle": "⚪",
			"white_large_square": "⬜",
			"black_large_square": "⬛"
		}

		/** shortcuts. use RegExp instead of string would be better. */
		shortcuts = {
			angry: ['>:(', '>:-('], // angry
			blush: [':")', ':-")'],
			broken_heart: ['</3', '<\\3'],
			// :\ and :-\ not used because of conflict with markdown escaping
			confused: [':/', ':-/'], // twemoji shows question
			cry: [":'(", ":'-(", ':,(', ':,-('],
			frowning: [':(', ':-('],
			heart: ['<3'],
			two_hearts: [/(<3|❤){2}/g],
			imp: [']:(', ']:-('],
			innocent: ['o:)', 'O:)', 'o:-)', 'O:-)', '0:)', '0:-)'],
			joy: [":')", ":'-)", ':,)', ':,-)', ":'D", ":'-D", ':,D', ':,-D'],
			kissing: [':*', ':-*'],
			laughing: ['x-)', 'X-)'],
			neutral_face: [':|', ':-|'],
			open_mouth: [':o', ':-o', ':O', ':-O'],
			rage: [':@', ':-@'],
			smile: [':D', ':-D'],
			smiley: [':)', ':-)'],
			smiling_imp: [']:)', ']:-)'],
			sob: [":,'(", ":,'-(", ';(', ';-('],
			stuck_out_tongue: [':P', ':-P'],
			sunglasses: ['8-)', 'B-)'],
			sweat: [',:(', ',:-('],
			sweat_smile: [',:)', ',:-)'],
			unamused: [':s', ':-S', ':z', ':-Z', ':$', ':-$'],
			wink: [';)', ';-)']
		}
	}
}