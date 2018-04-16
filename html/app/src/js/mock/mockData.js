Mock.mock(/\/assetProtectObject/, 'get', {
	  "items": [
	        {
	         "id": 1,
	         "name": "mysql2028",
	         "db_type": "mysql",
	         "object_type": "0",
	         "use_flag": "1"
	       },
	       {
	         "id": 2,
	         "name": "ora2332",
	         "db_type": "oracle",
	         "object_type": "1",
	         "use_flag": "0"
	       }
	     ],
	     "currentPage": 1,
	     "totalItems": 117,
	     "totalPage": 12,
	     "pageSize": 10,
	     "orderField": "name",
	     "ascend": false,
	     "paged": true,
});

Mock.mock(/\/asset\/database\/[1-9]\/[1-9]\?cmd=set/,'post', 200 );

Mock.mock(/\/asset\/database\/[1-9]\?cmd=delete/,'post', 200 );

Mock.mock(/\/assetProtectObject/,'post', { "result": "保存成功"} );

Mock.mock(/\/protectObj\/asset\/hosts\?cmd=scan/, 'post', [
	 	{
			"id":123,
			"obj_name":"123tt",
			"host":"192.168.1.11",
			"port":"3363",
			"db_type":"mysql",
			"version":"5.5.6"
	 	},
	 	{
			"id":1234,
			"obj_name":"123tt2",
			"host":"192.168.1.112",
			"port":"33632",
			"db_type":"mysql2",
			"version":"5.5.62"
	 	}
	 ]
);

Mock.mock(/\/CassetProtectObject\/[1-9]/, 'get', {
		  
		  "id":1,
		  "name":"test1",
		  "db_type":"Oracle",
		  "db_version":"",
		  "object_type":"1",
		  "use_flag":"1",
		  "nodeList":[
			   {
			    "node_id":1,
			    "proId":"1",
			    "node_name":"aaa",
			    "host":"192.168.200.106",
			    "port":"1521",
			    "node_use_flag":"1"
			  },
			  {
			    "node_id":2,
			    "proId":"1",
			    "node_name":"bbb",
			    "host":"192.168.200.104",
			    "port":"1521",
			    "node_use_flag":"0"
		
			  }
		  ]
	}

);

Mock.mock(/\/assetProtectObject\/[0-9]\?cmd=update/,'post', { "result": "保存成功"} );

Mock.mock(/\/assetProtectNode\?cmd=update/,'post', { "result": "保存成功"} );

Mock.mock(/\/protectObj\/asset\/assetConne/,'get', {
	"obj_id":4548,
	"currentPage":1,
	"pageSize":10,
	"cluster_flag":0,
	"conns": [
	 {
	  "id":455,
	  "name":"xxx2",
	  "lable_level":"高",
	  "asset_attr":"自定义",
	  "audit_level":"中",
	  "conn_type":"1"
	 },
	 {
	  "id":4355,
	  "name":"xxx",
	  "lable_level":"高",
	  "asset_attr":"自定义",
	  "audit_level":"中",
	  "conn_type":"0"
	 }
	]
   }
   
 );

Mock.mock(/\/protectObj\/asset\/assetObjs/,'get', [{"id":123,"name":"objTest","iconSkin":"obj","pro_type":3,"catogory":1,"type":2,"children":[{"id":321,"name":"AAA","iconSkin":"node","host":"192.168.22.22","port":3316,"run_status":"启用","db-type":"mysql","version":"5.5.7","children":[{"id":445,"name":"dbTest","iconSkin":"db","children":[{"id":953,"name":"tableTest","iconSkin":"table","table_type":"xxx","children":[{"id":774,"name":"type","iconSkin":"colum"},{"id":775,"name":"catogory","iconSkin":"colum"}]},{"id":858,"name":"aaa","iconSkin":"schema"},{"id":946,"name":"ttg","iconSkin":"view"}]}]}]}]);

Mock.mock(/\/protectObj\/asset\/assetObjs/,'post', { "result": "success"} );

Mock.mock(/\/protectObj\/asset\/subAsset/,'get', {
		"obj_id":123,
		"asset_id":456,
		"asset_type":"aaa",
		"sub_type":"table",
		"chilrens":[
		 {
		  "id":789,
		  "name":"bbb",
		  "iconSkin":"table"
		 },
		 {
		  "id":229,
		  "name":"bbb",
		  "iconSkin":"table"
		 }
	   ]
	}
);

Mock.mock(/\/protectObj\/asset\/[0-9]/,'get', {
	"obj_id":123,
	"asset_id":456,
	"use_flag":1,
	"asset_type":"schema",
	"parent_asset_name":"db_type",
	"parent_asset_type":"db",
	"lable_level":2,
	"audit_level":1,
	"subAssets":[
		 {
		  "sub_size":10,
		  "sub_type":"table"
		 },
		 {
		  "sub_size":24,
		  "sub_type":"table"
		 }
	   ]
	}

);

Mock.mock(/\/protectObj\/sensAsset\/list\/[0-9]/,'get', {
	"pro_id":123,
	"pro_name": '保护对象名',
	"conns": [
	  {
	  "id":789,
	  "conn_name":"aaa",
	  "filter_type":"资产集合",
	  "filter_condition":"全部资产"
	  },
	  {
	  "id":7449,
	  "conn_name":"bbb",
	  "filter_type":"资产集合",
	  "filter_condition":"部分资产"
	  }
	 ]
	}
);

Mock.mock(/\/protectObj\/unsensAsset\/list\/[0-9]/,'get', {
	"pro_id":123,
	"pro_name": '保护对象名',
	"conns": [
	  {
	  "id":7891,
	  "conn_name":"aaa",
	  "filter_type":"资产集合",
	  "filter_condition":"全部资产",
	  "filter":"全部资产111"
	  },
	  {
	  "id":74491,
	  "conn_name":"bbb",
	  "filter_type":"资产集合",
	  "filter_condition":"部分资产",
	  "filter":"全部资产11222"
	  }
	 ]
	}
);
