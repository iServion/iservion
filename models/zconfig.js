module.exports = {
		 table : "zconfig",
		 routeName : "zconfig",
		 title : "Zconfig",
		 keys : [
			 "id",
			 "company_id",
			 "updated_by",
			 "created_by",
			 "created_at",
			 "updated_at",
			 "layout",
			 "frameworkcss",
			 "json",
			 "nama",
			 "harga"
		 ], 
		 keysExcel : [
			 "id",
			 "company_id",
			 "updated_by",
			 "created_by",
			 "created_at",
			 "updated_at",
			 "layout",
			 "frameworkcss",
			 "json",
			 "nama",
			 "harga"
		 ], 
		 labels : {
			 id : "Id",
			 company_id : "Company",
			 updated_by : "Updated By",
			 created_by : "Created By",
			 created_at : "Created At",
			 updated_at : "Updated At",
			 layout : "Layout",
			 frameworkcss : "Frameworkcss",
			 json : "Json",
			 nama : "Nama",
			 harga : "Harga",
			 no : "#",
			 actionColumn : "Action"
		 }, 
		 fields : {
			 id : {
				 name : "id",
				 title : "Id",
				 placeholder : "Id",
				 type : "int",
				 category : "integer",
				 length : "", 
				 required : true,
				 search : "=",
				 key : "PRI"
			 }, 
			 company_id : {
				 name : "company_id",
				 title : "Company",
				 placeholder : "Company",
				 type : "int",
				 category : "integer",
				 length : "", 
				 required : true,
				 search : "=",
				 key : "MUL"
			 }, 
			 updated_by : {
				 name : "updated_by",
				 title : "Updated By",
				 placeholder : "Updated By",
				 type : "int",
				 category : "integer",
				 length : "", 
				 required : true,
				 search : "=",
				 key : ""
			 }, 
			 created_by : {
				 name : "created_by",
				 title : "Created By",
				 placeholder : "Created By",
				 type : "int",
				 category : "integer",
				 length : "", 
				 required : true,
				 search : "=",
				 key : ""
			 }, 
			 created_at : {
				 name : "created_at",
				 title : "Created At",
				 placeholder : "Created At",
				 type : "datetime",
				 category : "datetime",
				 length : "",
				 required : false,
				 search : "LIKE",
				 key : ""
			 }, 
			 updated_at : {
				 name : "updated_at",
				 title : "Updated At",
				 placeholder : "Updated At",
				 type : "datetime",
				 category : "datetime",
				 length : "",
				 required : false,
				 search : "LIKE",
				 key : ""
			 }, 
			 layout : {
				 name : "layout",
				 title : "Layout",
				 placeholder : "Layout"
			 }, 
			 frameworkcss : {
				 name : "frameworkcss",
				 title : "Frameworkcss",
				 placeholder : "Frameworkcss"
			 }, 
			 json : {
				 name : "json",
				 title : "Json",
				 placeholder : "Json"
			 }, 
			 nama : {
				 name : "nama",
				 title : "Nama",
				 placeholder : "Nama",
				 type : "varchar(255) ",
				 category : "text",
				 length : "",
				 required : false,
				 search : "LIKE",
				 key : ""
			 }, 
			 harga : {
				 name : "harga",
				 title : "Harga",
				 placeholder : "Harga",
				 type : "real",
				 category : "integer",
				 length : "",
				 required : false,
				 search : "=",
				 key : ""
			 }, 
			 no : {
				 name : "no",
				 title : "#",
				 placeholder : "#"
			 }, 
			 actionColumn : {
				 name : "actionColumn",
				 title : "Action",
				 placeholder : "Action"
			 },
		 }, 
		 options : {
			 id : "=",
			 company_id : "=",
			 updated_by : "=",
			 created_by : "=",
			 created_at : "LIKE",
			 updated_at : "LIKE",
			 layout : "", 
			 frameworkcss : "", 
			 json : "", 
			 nama : "LIKE",
			 harga : "=",
			 no : "", 
			 actionColumn : "",
		 }, 
		 grids : {
			 visibles : [
			 	"no",
			 	"nama",
			 	"harga",
			 	"actionColumn"
			 ], 
			 invisibles : [
			 	"id",
			 	"company_id",
			 	"updated_by",
			 	"created_by",
			 	"created_at",
			 	"updated_at",
			 	"layout",
			 	"frameworkcss",
			 	"json"
			 ],
		 }, 
		 datas : {
			 id : "",
			 company_id : "",
			 updated_by : "",
			 created_by : "",
			 created_at : "",
			 updated_at : "",
			 layout : "",
			 frameworkcss : "",
			 json : "",
			 nama : "",
			 harga : "",
			 no : "",
			 actionColumn : ""
		 }, 
		 widgets : {
			 id : {
				 name : "integer",
				 hidden : false
			 }, 
			 created_at : {
				 name : "datetime",
				 hidden : true
			 }, 
			 updated_at : {
				 name : "datetime",
				 hidden : true
			 }, 
			 created_by : {
				 name : "relation",
				 table : "zuser",
				 fields : [
			 		"id",
			 		"fullname"
				 ], 
				 hidden : true
			 }, 
			 updated_by : {
				 name : "relation",
				 table : "zuser",
				 fields : [
			 		"id",
			 		"fullname"
				 ], 
				 hidden : true
			 }, 
			 nama : {
				 name : "text",
				 hidden : false
			 }, 
			 harga : {
				 name : "number",
				 hidden : false
			 },
		 }, 
}