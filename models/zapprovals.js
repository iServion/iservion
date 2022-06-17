module.exports = {
		 table : "zapprovals",
		 routeName : "zapprovals",
		 title : "ZApprovals",
		 keys : [
			 "id",
			 "company_id",
			 "created_at",
			 "updated_at",
			 "created_by",
			 "updated_by",
			 "id_data",
			 "template",
			 "title",
			 "approvers",
			 "type",
			 "status",
			 "table",
			 "token",
			 "approved_stats",
			 "knowing_stats",
			 "knowings"
		 ], 
		 keysExcel : [
			 "id",
			 "company_id",
			 "created_at",
			 "updated_at",
			 "created_by",
			 "updated_by",
			 "id_data",
			 "template",
			 "title",
			 "approvers",
			 "type",
			 "status",
			 "table",
			 "token",
			 "approved_stats",
			 "knowing_stats",
			 "knowings"
		 ], 
		 labels : {
			 id : "Id",
			 company_id : "Company",
			 created_at : "Created At",
			 updated_at : "Updated At",
			 created_by : "Created By",
			 updated_by : "Updated By",
			 id_data : "ID Data",
			 template : "Template",
			 title : "Title",
			 approvers : "Approvers",
			 type : "Type",
			 status : "Status",
			 table : "Table",
			 token : "Token",
			 approved_stats : "Approved Stats",
			 knowing_stats : "Knowing Stats",
			 knowings : "Knowings",
			 no : "No",
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
			 id_data : {
				 name : "id_data",
				 title : "ID Data",
				 placeholder : "ID Data",
				 type : "double",
				 category : "integer",
				 length : "",
				 required : false,
				 search : "=",
				 key : ""
			 }, 
			 template : {
				 name : "template",
				 title : "Template",
				 placeholder : "Template",
				 type : "text",
				 category : "text",
				 length : "",
				 required : false,
				 search : "LIKE",
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
				 search : "LIKE",
				 key : ""
			 }, 
			 approvers : {
				 name : "approvers",
				 title : "Approvers",
				 placeholder : "Approvers",
				 type : "json",
				 category : "json",
				 length : "",
				 required : false,
				 search : "LIKE",
				 key : ""
			 }, 
			 type : {
				 name : "type",
				 title : "Type",
				 placeholder : "Type",
				 type : "tinyint(2)",
				 category : "integer",
				 length : "",
				 required : true,
				 search : "=",
				 key : ""
			 }, 
			 status : {
				 name : "status",
				 title : "Status",
				 placeholder : "Status",
				 type : "tinyint(2)",
				 category : "integer",
				 length : "",
				 required : true,
				 search : "=",
				 key : ""
			 }, 
			 table : {
				 name : "table",
				 title : "Table",
				 placeholder : "Table",
				 type : "varchar(255) ",
				 category : "text",
				 length : "",
				 required : false,
				 search : "LIKE",
				 key : ""
			 }, 
			 token : {
				 name : "token",
				 title : "Token",
				 placeholder : "Token",
				 type : "varchar(255) ",
				 category : "text",
				 length : "",
				 required : false,
				 search : "LIKE",
				 key : ""
			 }, 
			 approved_stats : {
				 name : "approved_stats",
				 title : "Approved Stats",
				 placeholder : "Approved Stats",
				 type : "varchar(255) ",
				 category : "text",
				 length : "",
				 required : false,
				 search : "LIKE",
				 key : ""
			 }, 
			 knowing_stats : {
				 name : "knowing_stats",
				 title : "Knowing Stats",
				 placeholder : "Knowing Stats",
				 type : "varchar(255) ",
				 category : "text",
				 length : "",
				 required : false,
				 search : "LIKE",
				 key : ""
			 }, 
			 knowings : {
				 name : "knowings",
				 title : "Knowings",
				 placeholder : "Knowings",
				 type : "json",
				 category : "json",
				 length : "",
				 required : false,
				 search : "LIKE",
				 key : ""
			 },
		 }, 
		 options : {
			 id : "=",
			 company_id : "=",
			 created_at : "LIKE",
			 updated_at : "LIKE",
			 created_by : "=",
			 updated_by : "=",
			 id_data : "=",
			 template : "LIKE",
			 title : "LIKE",
			 approvers : "",
			 type : "=",
			 status : "=",
			 table : "LIKE",
			 token : "LIKE",
			 approved_stats : "LIKE",
			 knowing_stats : "LIKE",
			 knowings : "LIKE"
		 }, 
		 grids : {
			 visibles : [
			 	"no",
			 	"title",
			 	"approved_stats",
			 	"knowing_stats",
			 	"approvers",
			 	"status",
			 	"actionColumn"
			 ], 
			 invisibles : [
			 	"id",
			 	"company_id",
			 	"created_at",
			 	"updated_at",
			 	"created_by",
			 	"updated_by",
			 	"id_data",
			 	"template",
			 	"type",
			 	"table",
			 	"token",
			 	"knowings"
			 ],
		 }, 
		 datas : {
			 id : "",
			 company_id : "",
			 created_at : "",
			 updated_at : "",
			 created_by : "",
			 updated_by : "",
			 id_data : "",
			 template : "",
			 title : "",
			 approvers : "",
			 type : "",
			 status : "",
			 table : "",
			 token : "",
			 approved_stats : "",
			 knowing_stats : "",
			 knowings : ""
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
			 id_data : {
				 name : "number",
				 hidden : false
			 }, 
			 template : {
				 name : "editor",
				 hidden : false
			 }, 
			 title : {
				 name : "text",
				 hidden : false
			 }, 
			 approvers : {
				 name : "dropdown_multi",
				 hidden : false,
				 table : "zuser",
				 fields : [
			 		"id",
			 		"CONCAT(fullname)"
				 ], 
				 hasCompanyId : true
			 }, 
			 type : {
				 name : "select",
				 hidden : false,
				 fields : {
					 1 : "Pararel",
					 2 : "Serial"
				 },
			 }, 
			 status : {
				 name : "select",
				 hidden : false,
				 fields : {
					 1 : "Draft",
					 2 : "Submit",
					 3 : "Approved",
					 4 : "Rejected",
					 5 : "Process",
					 6 : "Read",
					 7 : "Unread"
				 },
			 }, 
			 table : {
				 name : "text",
				 hidden : false
			 }, 
			 token : {
				 name : "text",
				 hidden : true
			 }, 
			 approved_stats : {
				 name : "text",
				 hidden : true
			 }, 
			 knowing_stats : {
				 name : "text",
				 hidden : false
			 }, 
			 knowings : {
				 name : "dropdown_multi",
				 hidden : false,
				 table : "zuser",
				 fields : [
			 		"id",
			 		"CONCAT(fullname)"
				 ], 
				 hasCompanyId : true
			 },
		 }, 
}