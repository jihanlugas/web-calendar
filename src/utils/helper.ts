import { typeCheck } from '@/utils/validate';
import { v4 as uuidv4 } from 'uuid';

export const convertJsonData = (json) => {
	const datePattern = new RegExp(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d*)?Z/);
	// var moneyPattern = new RegExp(/^\d+\.\d{4}$/);

	Object.keys(json).forEach((jsonKey) => {
		if (typeCheck.isString(json[jsonKey]) && datePattern.test(json[jsonKey])) {
			json[jsonKey] = new Date(json[jsonKey]);
		}
		// else if (typeCheck.isString(json[jsonKey]) && moneyPattern.test(json[jsonKey])) {
		//     json[jsonKey] = toDecimal(json[jsonKey],pagingComposer.currAcct.decimalPlaces).toString();
		// }
		else if (typeCheck.isObject(json[jsonKey])) {
			json[jsonKey] = convertJsonData(json[jsonKey]);
		}

		else if (Array.isArray(json[jsonKey])) {
			json[jsonKey].forEach((v) => {
				convertJsonData(v);
			});
		}

	});

	return json;
};

export const getRandomKanji = (): string => {
	const randomKanji = '一右雨円王音下火花貝学気休玉金九空月犬見五口校左三山四子糸字耳七車手十出女小上森人水正生青石赤先千川早草足村大男竹中虫町天田土二日入年白八百文本名木目夕立力林六引羽雲園遠黄何夏家科歌画会回海絵外角楽活間丸岩顔帰汽記弓牛魚京強教近兄形計元原言古戸午後語交光公工広考行高合国黒今才細作算姉市思止紙寺時自室社弱首秋週春書少場色食心新親図数星晴声西切雪線船前組走多太体台谷知地池茶昼朝長鳥直通弟店点電冬刀東当答頭同道読内南肉馬買売麦半番父風分聞米歩母方北妹毎万明鳴毛門夜野矢友曜用来理里話';

	return randomKanji.charAt(Math.floor(Math.random() * 1000) % randomKanji.length);
};

export const toObjectKeyValue = (data: any[], key: string, value: string) => {
	const res = {};

	data.forEach(dataobeject => {
		res[dataobeject[key]] = dataobeject[value];
	});


	return res;

};

export const getInitialWord = (word: string): string => {
	const split = word.split(' ');
	if (split.length > 1) {
		return split[0].charAt(0) + split[1].charAt(0);
	} else {
		return split[0].charAt(0);
	}
};

export const getUuid = (): string => {
	return uuidv4()
}

export const removeEmptyValues = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== null && value !== undefined && value !== '')
  );
}

export const copyToClipboardWithFallback = async (text: string): Promise<boolean> => {
  // try {
  //   await navigator.clipboard.writeText(text);
  //   return true;
  // } catch (err) {
    // console.warn('Clipboard API failed, using fallback.', err);

    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed'; // avoid scroll jump
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (fallbackErr) {
      console.error('Fallback copy failed', fallbackErr);
      return false;
    }
  // }
};