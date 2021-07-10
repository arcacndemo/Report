function codeDiffMerge() {
		var i, mergelycontent;
		mergelycontent = document.getElementsByClassName("mergelydiff");
		for(i = 1; i < mergelycontent.length; i++) {
				$('#mergely'+i).mergely({
					license: 'lgpl',
					cmsettings: {
						readOnly: true
					},
					lhs: function(setValue) {
						setValue('vulnerable code\nsql injection');
					},
					rhs: function(setValue) {
						setValue('Remediate code\nsql injection, persistence');
					}
				});
			}
		}