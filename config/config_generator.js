module.exports = {
    newLine: '\r\n',
    tab: '\t',
    //table list is not for generate
    notGenerateTable: ['index', 'uploads', 'js', 'css', 'log', 'roles', 'zrole', 'zgrid',
        'generator', 'zwidgets', 'your_widgets', 'zreports_setting', 'api', 'zapi','user','company','user_company','your_widgets',
        'zapprovals','zapprovals_detail','zconfig','zerror','zgrid','zlistener','zfields','zmenu','zreport','zrole'],
    //notGenerateTable:[],
    //list is hide for form, maybe for automation
    notRenderField: ['id', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy', 'companyId', 'created_at', 'updated_at','updated_by', 'created_by', 'modified_by', 'company_id', 'token', 'version', 'signin_method', 'lastLogin', 'last_login', 'forgotPassword', 'forgot_password'],
    //images field list
    imagesName: [
        'image', 'images',
        'logo',
        'file', 'files',
        'photo', 'photoFront', 'photoBehind', 'photoLeft', 'photoRight', 'photoTop', 'photoBelow', 'profile_pic',
        'avatar', 'flag',
        'document',
        'cv',
        'upload',
        'cardTax', 'cardFamily', 'cardKtp', 'cardCertificate', 'cardHealth', 'cardEmployment',
        'attachment', 'attachmentHealth', 'attachmentAccident', 'thumbnail', 'thumbnail2'
    ],
    commonField: ['full_name', 'name', 'title', 'fullname', 'username', 'firstname', 'firstName', 'code', 'nik', 'employeeName'],
    createdUpdatedBy: ['createdBy', 'updatedBy', 'created_by', 'updated_by'],
    createdUpdatedAt: ['createdAt','updatedAt','created_at','updated_at'],
    timeAt: ['createdAt','updatedAt','created_at','updated_at','modified_at'],
    //your user table for login and session
    userTable: 'zuser',
    userId: 'user_id',
    userFieldName: 'fullname',
    companyId: 'company_id',
    company_id: 'company_id',
    userCompanyTable: 'zuser_company', //blank if not used
}