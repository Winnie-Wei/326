angular
  	.module('myappApp.services', [])
  	.provider('configHeader', {
		setHeader: function(header) {
  			this.header = header;
  		},
  		$get: function() {
  			return this.header;
  		}
	})
  	.provider('configModules', {
		$get: function() {
			return [  
			  {
					multiple: true,
					label: '业务设置',
					folder:'businessSetting',
					children:[
						/*{
							state:'protectObj',
							label:'保护对象ex'
						},*/
						{
							state:'protectObject',
							label:'保护对象',
						},
						{
							state:'addProtectObj',
							label:'添加保护对象',
							hide: true
						},
						{
							state:'protectObjInfo',
							label:'保护对象详情',
							params: 'POid',
							hide: true
						},
						{
							state:'assetTab',
							label:'资产管理',
							params: 'POid',
							hide: true
						},
						{
							state:'selectAudit',
							label:'选择性审计',
							params: 'POid',
							hide: true
						},
						{
							state:'autoAddObj',
							label:'智能添加保护对象',
							hide: true
						}
					]
				},
				{
					multiple: true,
					label: '探针管理',
					folder:'probeManage',
					children:[
						{
							state:'bypassProbe',
							label:'云旁路探针'
						}
					]
				}
			];
		}
	})
