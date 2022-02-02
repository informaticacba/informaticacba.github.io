global.captchaExtName = "CAPTCHA";
global.captchaResponseField = "captcha";
let ext = GetExtensionObject(captchaExtName), path = GetPath();
global.captchaFont = ext.PROJ.Font || "aftershock";
captchaFont = path.basename(captchaFont, path.extname(captchaFont)); // Remove extension