/**
 * Created by sintret dev on 2/21/2022.
 */
var connection = require('./../config/connection');
const Util = require('./Util')
const {execute} = require('@getvim/execute');

var zup={}


zup.createTable = async() => {
    var sql = `
    
    CREATE TABLE public.application_list (
    id BIGSERIAL PRIMARY KEY,
    company_id bigint NOT NULL,
    updated_by bigint,
    created_by bigint,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    client_pc_id bigint,
    version character varying(255) DEFAULT NULL::character varying,
    name character varying(255) DEFAULT NULL::character varying
);
    
    
    
CREATE TABLE public.client_pc (
    id BIGSERIAL PRIMARY KEY,
    company_id bigint NOT NULL,
    updated_by bigint,
    created_by bigint,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    name character varying(255) DEFAULT NULL::character varying,
    address character varying(255) DEFAULT NULL::character varying,
    code character varying(255) DEFAULT NULL::character varying
);

CREATE TABLE public.commands (
    id BIGSERIAL PRIMARY KEY,
    company_id bigint NOT NULL,
    updated_by bigint,
    created_by bigint,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    server_id bigint,
    service_id bigint,
    command character varying(255) DEFAULT NULL::character varying,
    description text,
    response_format character varying(255) DEFAULT NULL::character varying,
    title character varying(255) DEFAULT 'test'::character varying,
    path character varying(255) DEFAULT NULL::character varying,
    long_command text
);


CREATE TABLE public.distro (
    id BIGSERIAL PRIMARY KEY,
    company_id bigint NOT NULL,
    updated_by bigint,
    created_by bigint,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    system_id bigint NOT NULL,
    title character varying(255) DEFAULT NULL::character varying,
    version character varying(255) DEFAULT NULL::character varying
);



CREATE TABLE public.operating_system (
    id BIGSERIAL PRIMARY KEY,
    company_id bigint NOT NULL,
    updated_by bigint,
    created_by bigint,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    title character varying(255) DEFAULT NULL::character varying,
    description text
);



CREATE TABLE public.server (
    id BIGSERIAL PRIMARY KEY,
    company_id bigint NOT NULL,
    updated_by bigint,
    created_by bigint,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    title character varying(255) DEFAULT NULL::character varying,
    host character varying(255) DEFAULT NULL::character varying,
    username character varying(255) DEFAULT NULL::character varying,
    type_id bigint,
    alert smallint,
    services text,
    file character varying(255) DEFAULT NULL::character varying,
    status smallint,
    description text,
    password character varying(255) DEFAULT NULL::character varying
);

CREATE TABLE public.server_type (
    id BIGSERIAL PRIMARY KEY,
    company_id bigint NOT NULL,
    updated_by bigint,
    created_by bigint,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    title character varying(255) DEFAULT NULL::character varying,
    region character varying(255) DEFAULT NULL::character varying
);


CREATE TABLE public.services (
    id BIGSERIAL PRIMARY KEY,
    company_id bigint NOT NULL,
    updated_by bigint,
    created_by bigint,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    server_id bigint,
    title character varying(255) DEFAULT NULL::character varying,
    description text,
    status smallint,
    display smallint,
    kept_alive smallint
);


CREATE TABLE public.zactivity (
    id BIGSERIAL PRIMARY KEY,
    company_id bigint NOT NULL,
    updated_by bigint,
    created_by bigint,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    user_id bigint,
    "table" character varying(255) DEFAULT NULL::character varying,
    title character varying(255) DEFAULT NULL::character varying,
    status bigint,
    status_label character varying(255) DEFAULT NULL::character varying,
    description text,
    id_data bigint,
    data text
);



CREATE TABLE public.zapi (
    id BIGSERIAL PRIMARY KEY,
    company_id bigint NOT NULL,
    updated_by bigint,
    created_by bigint,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    username character varying(255) DEFAULT NULL::character varying,
    token character varying(255) DEFAULT NULL::character varying,
    "table" character varying(255) DEFAULT NULL::character varying
);


CREATE TABLE public.zapprovals (
    id BIGSERIAL PRIMARY KEY,
    company_id bigint NOT NULL,
    updated_by bigint,
    created_by bigint,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    id_data real,
    template text,
    title character varying(255) DEFAULT NULL::character varying,
    approvers json,
    type smallint,
    status smallint NOT NULL,
    "table" character varying(255) DEFAULT NULL::character varying,
    token character varying(255) DEFAULT NULL::character varying,
    approved_stats character varying(255) DEFAULT NULL::character varying,
    knowing_stats character varying(255) DEFAULT NULL::character varying,
    knowings json
);



CREATE TABLE public.zcompany (
    id BIGSERIAL PRIMARY KEY,
    code character varying(50) DEFAULT NULL::character varying NOT NULL,
    name character varying(150) DEFAULT NULL::character varying NOT NULL,
    phone character varying(20) DEFAULT NULL::character varying,
    address text,
    director character varying(150) DEFAULT NULL::character varying,
    note text,
    updated_by bigint,
    created_by bigint,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    logo character varying(255) DEFAULT NULL::character varying
);

CREATE TABLE public.zconfig (
    id BIGSERIAL PRIMARY KEY,
    company_id bigint NOT NULL,
    updated_by bigint,
    created_by bigint,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    layout bigint DEFAULT 0,
    frameworkcss smallint DEFAULT 1,
    json json
);

CREATE TABLE public.zerror (
    id BIGSERIAL PRIMARY KEY,
    company_id bigint NOT NULL,
    updated_by bigint,
    created_by bigint,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    route character varying(255) DEFAULT NULL::character varying,
    "table" character varying(255) NOT NULL,
    description text
);


CREATE TABLE public.zfields (
    id BIGSERIAL PRIMARY KEY,
    "table" character varying(255) DEFAULT NULL::character varying NOT NULL,
    name character varying(255) DEFAULT NULL::character varying NOT NULL,
    route character varying(255) DEFAULT NULL::character varying,
    tabs json,
    labels json,
    details json,
    "left" json,
    "right" json,
    one_column json,
    sorting json,
    properties json,
    javascript_form text,
    javascript_grid text,
    hardcode_grid text,
    approval_content text,
    zapprovals text,
    before_create text,
    after_create text,
    before_update text,
    after_update text,
    before_delete text,
    after_delete text,
    before_list text,
    index_ejs text,
    indexcss_ejs text,
    indexjs_ejs text,
    form_ejs text,
    create_ejs text,
    createjs_ejs text,
    update_ejs text,
    updatejs_ejs text,
    import_ejs text,
    importjs_ejs text,
    view_ejs text,
    router text
);


CREATE TABLE public.zgrid (
    id BIGSERIAL PRIMARY KEY,
    updated_by bigint,
    created_by bigint,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    route_name character varying(255) DEFAULT NULL::character varying,
    user_id bigint,
    visibles json,
    invisibles json,
    labels json,
    filter json
);


CREATE TABLE public.zlayout (
    id BIGSERIAL PRIMARY KEY,
    company_id bigint NOT NULL,
    updated_by bigint,
    created_by bigint,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    name character varying(255) DEFAULT NULL::character varying NOT NULL,
    code text NOT NULL,
    notes text
);



CREATE TABLE public.zmenu (
    id BIGSERIAL PRIMARY KEY,
    company_id bigint NOT NULL,
    updated_by bigint,
    created_by bigint,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    name character varying(150) NOT NULL,
    json json,
    active smallint DEFAULT 0
);



CREATE TABLE public.znotification (
    id BIGSERIAL PRIMARY KEY,
    company_id bigint NOT NULL,
    updated_by bigint,
    created_by bigint,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    title character varying(255) DEFAULT NULL::character varying,
    description character varying(255) DEFAULT NULL::character varying,
    "table" character varying(255) DEFAULT NULL::character varying,
    user_id bigint,
    status bigint,
    status_label character varying(255) DEFAULT NULL::character varying,
    link character varying(255) DEFAULT NULL::character varying,
    token character varying(255) DEFAULT NULL::character varying,
    id_data bigint
);



CREATE TABLE public.zpage (
    id BIGSERIAL PRIMARY KEY,
    company_id bigint NOT NULL,
    updated_by bigint,
    created_by bigint,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    page character varying(255) DEFAULT NULL::character varying NOT NULL,
    method smallint NOT NULL,
    active smallint,
    note text,
    server_code text,
    client_code text
);



CREATE TABLE public.zreport (
    id BIGSERIAL PRIMARY KEY,
    company_id bigint NOT NULL,
    updated_by bigint,
    created_by bigint,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    title character varying,
    description text,
    json json,
    excel character varying,
    parent_id bigint,
    filters json,
    orderby text,
    wheres text,
    scripts text
);



CREATE TABLE public.zreport_filter (
    id BIGSERIAL PRIMARY KEY,
    updated_by bigint,
    created_by bigint,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    name character varying,
    label character varying,
    type smallint,
    value character varying
);



CREATE TABLE public.zrole (
    id BIGSERIAL PRIMARY KEY,
    name character varying(150) NOT NULL,
    params json
);



CREATE TABLE public.zuser (
    id BIGSERIAL PRIMARY KEY,
    company_id bigint,
    role_id bigint NOT NULL,
    updated_by bigint,
    created_by bigint,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    token character varying(100) NOT NULL,
    username character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    fullname character varying(255) NOT NULL,
    address text,
    phone character varying(50) DEFAULT NULL::character varying,
    city character varying(100) DEFAULT NULL::character varying,
    image text,
    active smallint DEFAULT 0,
    datas text,
    last_login timestamp with time zone,
    forgot_password character varying(100) DEFAULT NULL::character varying,
    language character varying(255) DEFAULT NULL::character varying,
    signing character varying(255) DEFAULT NULL::character varying,
    verify_signed character varying(255) DEFAULT NULL::character varying
);



CREATE TABLE public.zuser_company (
    id BIGSERIAL PRIMARY KEY,
    role_id bigint NOT NULL,
    user_id bigint NOT NULL,
    company_id bigint NOT NULL
);



CREATE TABLE public.zwidget (
    id BIGSERIAL PRIMARY KEY,
    company_id bigint NOT NULL,
    updated_by bigint,
    created_by bigint,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    title character varying(255) DEFAULT NULL::character varying,
    scripts text,
    check_installer text,
    image character varying(255) DEFAULT NULL::character varying,
    description text,
    publish smallint,
    parameter json,
    remove text
);


CREATE TABLE public.zwidget_setting (
    id BIGSERIAL PRIMARY KEY,
    company_id bigint NOT NULL,
    updated_by bigint,
    created_by bigint,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    name character varying(255) DEFAULT NULL::character varying,
    type smallint,
    value character varying(255) DEFAULT NULL::character varying
);
    `;

    await connection.query(sql);
    return 1;
}


zup.addData = async() => {
    //insert data into zuser
    var email = "admin@admin.com";
    var result = await connection.insert({
        table : "zuser",
        data : {
            token : Util.generateUnique(),
            username : email,
            email : email,
            password : Util.hash("123456"),
            fullname : "admin",
            role_id : 1,
            company_id : 1,
            active : 1,
            created_by :1,
            updated_by : 1
        }
    });

    var result = await connection.insert({
        table : "zcompany",
        data : {
            code : "ME",
            name : "MY Great Company",
            updated_by : 1,
            created_by : 1
        }
    });

    //zrole setup
    var result = await connection.insert({
        table : "zrole",
        data : {
            id : 1,
            name : "Super Admin",
            params : JSON.stringify({"application_list":["index","view","import","export"],"client_pc":["index","create","update","delete","view","import","export"],"commands":["index","create","update","delete","view","import","export"],"distro":["index","create","update","delete","view","import","export"],"index":["index","create","update","delete","view","import","export"],"operating_system":["index","create","update","delete","view","import","export"],"server":["index","create","update","delete","view","import","export"],"server_type":["index","create","update","delete","view","import","export"],"services":["index","create","update","delete","view","import","export"],"zapi":["index","create","update","delete","view","import","export"],"zauth":["index","create","update","delete","view","import","export"],"zcompany":["index","create","update","delete","view","import","export"],"zdashboard":["index","create","update","delete","view","import","export"],"zfields":["index","create","update","delete","view","import","export"],"zgenerator":["index","create","update","delete","view","import","export"],"zinstaller":["index","create","update","delete","view","import","export"],"zlayout":["index","create","update","delete","view","import","export"],"zmenu":["index","create","update","delete","view","import","export"],"znotification":["index","create","update","delete","view","import","export"],"zpage":["index","create","update","delete","view","import","export"],"zreport":["index","create","update","delete","view","import","export"],"zrole":["index","create","update","delete","view","import","export"],"zuser":["index","create","update","delete","view","import","export"],"zuser_company":["index","create","update","delete","view","import","export"],"zwidget":["index","create","update","delete","view","import","export"]})
        }
    })
    var result = await connection.insert({
        table : "zrole",
        data : {
            id : 2,
            name : "Admin",
            params : JSON.stringify({"zdashboard":["index","create","update","delete","view","import","export","approval"]})

        }
    })
    var result = await connection.insert({
        table : "zrole",
        data : {
            id : 3,
            name : "Editor",
            params : JSON.stringify({"zdashboard":["index","create","update","delete","view","import","export","approval"]})

        }
    })
    var result = await connection.insert({
        table : "zrole",
        data : {
            id : 4,
            name : "Other",
            params : JSON.stringify({"zdashboard":["index","create","update","delete","view","import","export","approval"]})
        }
    })

    //setup
    var result = await connection.insert({
        table : "zuser_company",
        data : {
            id : 4,
            user_id : 1,
            company_id : 1,
            role_id : 1
        }
    })


    //menu
    await connection.insert({
        table : "zmenu",
        data : {
            id : 1,
            company_id : 1,
            updated_by : 1,
            created_by : 1,
            name : "Standart",
            active : 1,
            json : JSON.stringify([{"text":"Home","href":"zdashboard","icon":"fas fa-home","target":"_self","title":""},{"text":"Server","href":"server","icon":"fas fa-server","target":"_self","title":""},{"text":"Type","href":"server_type","icon":"fas fa-database","target":"_self","title":""},{"text":"Services","href":"services","icon":"fas fa-handshake","target":"_self","title":""},{"text":"Commands","href":"commands","icon":"fas fa-couch","target":"_self","title":""},{"text":"Client PC","href":"","icon":"fab fa-connectdevelop","target":"_self","title":"","children":[{"text":"Client PC","href":"client_pc","icon":"empty","target":"_self","title":""},{"text":"Applications","href":"application_list","icon":"empty","target":"_self","title":""}]},{"text":"Operating Systems","href":"","icon":"fas fa-asterisk","target":"_self","title":"","children":[{"text":"OS","href":"operating_system","icon":"empty","target":"_self","title":""},{"text":"Distro","href":"distro","icon":"empty","target":"_self","title":""}]},{"text":"API","href":"zapi","icon":"fas fa-book-open","target":"_self","title":""}])
        }
    });

    //add fk
    await connection.query(`
        ALTER TABLE zuser ADD CONSTRAINT fk_user_company FOREIGN KEY (company_id) REFERENCES zcompany (id);
        ALTER TABLE zuser ADD CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES zrole (id);
        
        ALTER TABLE zuser_company ADD CONSTRAINT fk_user_company_role FOREIGN KEY (role_id) REFERENCES zrole (id);
        ALTER TABLE zuser_company ADD CONSTRAINT fk_user_company_company FOREIGN KEY (company_id) REFERENCES zcompany (id);
        ALTER TABLE zuser_company ADD CONSTRAINT fk_user_company_user FOREIGN KEY (user_id) REFERENCES zuser (id);

        ALTER TABLE zmenu ADD CONSTRAINT fk_menu_company FOREIGN KEY (company_id) REFERENCES zmenu (id);
        
        ALTER TABLE zgrid ADD CONSTRAINT fk_zgrid_user FOREIGN KEY (user_id) REFERENCES zuser (id);
        
        
        ALTER TABLE zreport ADD CONSTRAINT fk_zreport_company FOREIGN KEY (company_id) REFERENCES zcompany (id);
        ALTER TABLE zreport ADD CONSTRAINT fk_zreport_menu FOREIGN KEY (parent_id) REFERENCES zreport (id);
        
    `);

    return result;
}



zup.menu = async() => {
    var r = "ok"
    try {
        //menu
        await connection.insert({
            table : "zmenu",
            data : {
                id : 1,
                company_id : 1,
                updated_by : 1,
                created_by : 1,
                name : "Standart",
                active : 1,
                json : JSON.stringify([{"text":"Home","href":"zdashboard","icon":"fas fa-home","target":"_self","title":""},{"text":"Server","href":"server","icon":"fab fa-algolia","target":"_self","title":"","children":[{"text":"Server","href":"server","icon":"far fa-address-book","target":"_self","title":""},{"text":"Type","href":"server_type","icon":"fab fa-adversal","target":"_self","title":""},{"text":"Services","icon":"fas fa-align-center","href":"services","target":"_self","title":""}]}])
            }
        });
    } catch(err) {

        r =  err.toString();
    }

    return r;
}




zup.backupDB = async() => {
    var fileName = `${dirRoot}db.sql`;
    execute(`pg_dump -f ${fileName}  postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`,).then(async() => {
        console.log("Backup Done...");
    }).catch(err => {
        console.log(err);
    });
}


zup.restoreDB = async()=> {
    //var fileName = `${dirRoot}monitoring_empty.backup`;
    var fileName = `${dirRoot}new.sql`;
    console.log(fileName)
    execute(`pg_restore -f ${fileName}  postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`).then(async() => {
        console.log("Restored");
    }).catch(err => {
        console.log(err);
    })

}

module.exports=zup;