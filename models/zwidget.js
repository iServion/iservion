module.exports = {
		 table : "zwidget",
		 routeName : "zwidget",
		 title : "ZWidget",
		 keys : [
			 "id",
			 "company_id",
			 "created_at",
			 "updated_at",
			 "created_by",
			 "updated_by",
			 "title",
			 "scripts",
			 "check_installer",
			 "image",
			 "description",
			 "publish",
			 "parameter",
			 "remove"
		 ], 
		 keysExcel : [
			 "id",
			 "company_id",
			 "created_at",
			 "updated_at",
			 "created_by",
			 "updated_by",
			 "title",
			 "scripts",
			 "check_installer",
			 "image",
			 "description",
			 "publish",
			 "parameter",
			 "remove"
		 ], 
		 labels : {
			 id : "Id",
			 company_id : "Company",
			 created_at : "Created At",
			 updated_at : "Updated At",
			 created_by : "Created By",
			 updated_by : "Updated By",
			 title : "Title",
			 scripts : "Scripts",
			 check_installer : "Check Installer",
			 image : "Image",
			 description : "Description",
			 publish : "Publish",
			 parameter : "Parameter",
			 remove : "Remove",
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
			 created_at : {
				 name : "created_at",
				 title : "Created At",
				 placeholder : "Created At",
				 type : "datetime",
				 category : "datetime",
				 length : "",
				 required : false,
				 search : "ILIKE",
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
				 search : "ILIKE",
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
			 title : {
				 name : "title",
				 title : "Title",
				 placeholder : "Title",
				 type : "varchar(255) ",
				 category : "text",
				 length : "",
				 required : false,
				 search : "ILIKE",
				 key : ""
			 }, 
			 scripts : {
				 name : "scripts",
				 title : "Scripts",
				 placeholder : "Scripts",
				 type : "text",
				 category : "text",
				 length : "",
				 required : false,
				 search : "ILIKE",
				 key : ""
			 }, 
			 check_installer : {
				 name : "check_installer",
				 title : "Check Installer",
				 placeholder : "Check Installer",
				 type : "text",
				 category : "text",
				 length : "",
				 required : false,
				 search : "ILIKE",
				 key : ""
			 }, 
			 image : {
				 name : "image",
				 title : "Image",
				 placeholder : "Image",
				 type : "varchar(255) ",
				 category : "text",
				 length : "",
				 required : false,
				 search : "ILIKE",
				 key : ""
			 }, 
			 description : {
				 name : "description",
				 title : "Description",
				 placeholder : "Description",
				 type : "text",
				 category : "text",
				 length : "",
				 required : false,
				 search : "ILIKE",
				 key : ""
			 }, 
			 publish : {
				 name : "publish",
				 title : "Publish",
				 placeholder : "Publish",
				 type : "smallint",
				 category : "integer",
				 length : "",
				 required : false,
				 search : "=",
				 key : ""
			 }, 
			 parameter : {
				 name : "parameter",
				 title : "Parameter",
				 placeholder : "Parameter",
				 type : "json",
				 category : "json",
				 length : "",
				 required : false,
				 search : "ILIKE",
				 key : ""
			 }, 
			 remove : {
				 name : "remove",
				 title : "Remove",
				 placeholder : "Remove",
				 type : "text",
				 category : "text",
				 length : "",
				 required : false,
				 search : "ILIKE",
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
			 created_at : "ILIKE",
			 updated_at : "ILIKE",
			 created_by : "=",
			 updated_by : "=",
			 title : "ILIKE",
			 scripts : "ILIKE",
			 check_installer : "ILIKE",
			 image : "ILIKE",
			 description : "ILIKE",
			 publish : "=",
			 parameter : "ILIKE",
			 remove : "ILIKE",
			 no : "", 
			 actionColumn : "",
		 }, 
		 grids : {
			 visibles : [
			 	"no",
			 	"title",
			 	"scripts",
			 	"check_installer",
			 	"remove",
			 	"actionColumn"
			 ], 
			 invisibles : [
			 	"id",
			 	"company_id",
			 	"created_at",
			 	"updated_at",
			 	"created_by",
			 	"updated_by",
			 	"image",
			 	"description",
			 	"publish",
			 	"parameter"
			 ],
		 }, 
		 datas : {
			 id : "",
			 company_id : "",
			 created_at : "",
			 updated_at : "",
			 created_by : "",
			 updated_by : "",
			 title : "",
			 scripts : "",
			 check_installer : "",
			 image : "",
			 description : "",
			 publish : "",
			 parameter : "",
			 remove : "",
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
			 title : {
				 name : "text",
				 hidden : false
			 }, 
			 scripts : {
				 name : "ide_editor",
				 hidden : false,
				 information : "Running your bash script",
				 language : "sh"
			 }, 
			 check_installer : {
				 name : "ide_editor",
				 hidden : false,
				 information : "Script for check package",
				 language : "sh"
			 }, 
			 image : {
				 name : "image",
				 hidden : false
			 }, 
			 description : {
				 name : "editor",
				 hidden : false
			 }, 
			 publish : {
				 name : "switch",
				 hidden : false,
				 fields : [
			 		"No",
			 		"Yes"
				 ],
			 }, 
			 parameter : {
				 name : "table",
				 hidden : false,
				 table : "zwidget_setting",
				 hasCompanyId : true
			 }, 
			 remove : {
				 name : "ide_editor",
				 hidden : false,
				 information : "Script for remove a package",
				 language : "sh"
			 },
		 }, 
}