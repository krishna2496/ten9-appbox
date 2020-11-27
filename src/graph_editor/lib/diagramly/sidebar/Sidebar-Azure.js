/**
 * ten9, Inc
 * Copyright (c) 2015 - 2020 ten9, Inc
 * -----
 * NOTICE:  All information contained herein is, and remains
 * the property of ten9 Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to ten9 Incorporated
 * and its suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from ten9 Incorporated.
 * -----
 */

const {
  mxConstants,
  mxResources,
} = require('../../jgraph/mxClient.js');

const { Sidebar } = require('../../jgraph/Sidebar.js');

(function()
{
	Sidebar.prototype.addAzurePalette = function()
	{
		var w = 50;
		var h = 50;
		var s = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;align=center;strokeColor=none;fillColor=#00BEF2;shape=mxgraph.azure.';
		var gn = 'mxgraph.azure';
		var dt = '';
		this.setCurrentSearchEntryLibrary('azure');

		this.addPaletteFunctions('azure', mxResources.get('azure'), false,
		[
			this.createVertexTemplateEntry(s + 'access_control;', w, h, '', 'Access Control', null, null, this.getTagsForStencil(gn, 'access_control', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'automation;pointerEvents=1;', w, h * 0.9, '', 'Automation', null, null, this.getTagsForStencil(gn, 'automation', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'autoscale;', w, h * 0.6, '', 'AutoScale', null, null, this.getTagsForStencil(gn, 'autoscale', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'azure_active_directory;', w * 0.95, h, '', 'Azure Active Directory', null, null, this.getTagsForStencil(gn, 'azure_active_directory', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'azure_alert;', w, h * 0.85, '', 'Azure Alert', null, null, this.getTagsForStencil(gn, 'azure_alert', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'azure_cache;', w * 0.9, h, '', 'Azure Cache', null, null, this.getTagsForStencil(gn, 'azure_cache', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'azure_instance;', w, h, '', 'Azure Instance', null, null, this.getTagsForStencil(gn, 'azure_instance', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'azure_load_balancer;', w, h * 0.7, '', 'Azure Load Balancer', null, null, this.getTagsForStencil(gn, 'azure_load_balancer', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'azure_marketplace;', w * 0.8, h, '', 'Azure Marketplace', null, null, this.getTagsForStencil(gn, 'azure_marketplace', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'azure_sdk;', w, h * 0.95, '', 'Azure SDK', null, null, this.getTagsForStencil(gn, 'azure_sdk', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'azure_subscription;', w, h * 0.7, '', 'Azure Subscription', null, null, this.getTagsForStencil(gn, 'azure_subscription', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'azure_website;pointerEvents=1;', w, h, '', 'Azure Website', null, null, this.getTagsForStencil(gn, 'azure_website', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'backup_service;', w, h * 0.9, '', 'Backup Service', null, null, this.getTagsForStencil(gn, 'backup_service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'bitbucket_code_source;', w * 0.85, h, '', 'BitBucket Code Source', null, null, this.getTagsForStencil(gn, 'bitbucket_code_source', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'biztalk_services;', w, h, '', 'BizTalk Services', null, null, this.getTagsForStencil(gn, 'biztalk_services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'certificate;pointerEvents=1;', w, h * 0.8, '', 'Certificate', null, null, this.getTagsForStencil(gn, 'certificate', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'cloud;', w, h * 0.65, '', 'Cloud', null, null, this.getTagsForStencil(gn, 'cloud', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'cloud_service;', w, h * 0.8, '', 'Cloud Service', null, null, this.getTagsForStencil(gn, 'cloud_service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'cloud_services_configuration_file;pointerEvents=1;', w * 0.95, h, '', 'Cloud Services Configuration File', null, null, this.getTagsForStencil(gn, 'cloud_services_configuration_file', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'cloud_service_package_file;', w * 0.85, h, '', 'Cloud Service Package File', null, null, this.getTagsForStencil(gn, 'cloud_service_package_file', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'codeplex_code_source;', w, h * 0.75, '', 'CodePlex Code Source', null, null, this.getTagsForStencil(gn, 'codeplex_code_source', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'code_file;pointerEvents=1;', w * 0.95, h, '', 'Code File', null, null, this.getTagsForStencil(gn, 'code_file', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'computer;pointerEvents=1;', w, h * 0.9, '', 'Computer', null, null, this.getTagsForStencil(gn, 'computer', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'content_delivery_network;', w, h * 0.65, '', 'Content Delivery Network', null, null, this.getTagsForStencil(gn, 'content_delivery_network', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'database;', w * 0.75, h, '', 'Database', null, null, this.getTagsForStencil(gn, 'database', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'dropbox_code_source;', w, h * 0.95, '', 'DropBox Code Source', null, null, this.getTagsForStencil(gn, 'dropbox_code_source', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'enterprise;pointerEvents=1;', w * 0.6, h, '', 'Enterprise', null, null, this.getTagsForStencil(gn, 'enterprise', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'express_route;pointerEvents=1;', w, h * 0.6, '', 'Express Route', null, null, this.getTagsForStencil(gn, 'express_route', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'file;pointerEvents=1;', w * 0.95, h, '', 'File', null, null, this.getTagsForStencil(gn, 'file', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'file_2;pointerEvents=1;', w * 0.95, h, '', 'File 2', null, null, this.getTagsForStencil(gn, 'file_2', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'github_code;pointerEvents=1;', w, h, '', 'GitHub Code', null, null, this.getTagsForStencil(gn, 'github_code', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'git_repository;', w, h, '', 'Git Repository', null, null, this.getTagsForStencil(gn, 'git_repository', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'hdinsight;', w, h, '', 'HDInsight', null, null, this.getTagsForStencil(gn, 'hdinsight', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'healthy;', w, h * 0.9, '', 'Healthy', null, null, this.getTagsForStencil(gn, 'healthy', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'health_monitoring;', w, h * 0.85, '', 'Health Monitoring', null, null, this.getTagsForStencil(gn, 'health_monitoring', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'hyper_v_recovery_manager;', w, h * 0.9, '', 'Hyper-V Recovery Manager', null, null, this.getTagsForStencil(gn, 'hyper_v_recovery_manager', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'laptop;pointerEvents=1;', w, h * 0.6, '', 'Laptop', null, null, this.getTagsForStencil(gn, 'laptop', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'load_balancer_generic;pointerEvents=1;', w * 0.75, h, '', 'Load Balancer Generic', null, null, this.getTagsForStencil(gn, 'load_balancer_generic', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'media_service;pointerEvents=1;', w * 0.9, h, '', 'Media Service', null, null, this.getTagsForStencil(gn, 'media_service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'message;pointerEvents=1;', w, h * 0.75, '', 'Message', null, null, this.getTagsForStencil(gn, 'message', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'mobile;pointerEvents=1;', w * 0.7, h, '', 'Mobile', null, null, this.getTagsForStencil(gn, 'mobile', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'mobile_services;pointerEvents=1;', w * 0.65, h, '', 'Mobile Services', null, null, this.getTagsForStencil(gn, 'mobile_services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'multi_factor_authentication;pointerEvents=1;', w * 0.5, h, '', 'Multi Factor Authentication', null, null, this.getTagsForStencil(gn, 'multi_factor_authentication', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'mysql_database;', w * 0.75, h, '', 'MySQL Database', null, null, this.getTagsForStencil(gn, 'mysql_database', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'notification_hub;pointerEvents=1;', w, h, '', 'Notification Hub', null, null, this.getTagsForStencil(gn, 'notification_hub', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'notification_topic;', w, h, '', 'Notification Topic', null, null, this.getTagsForStencil(gn, 'notification_topic', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'operating_system_image;', w, h, '', 'Operating System Image', null, null, this.getTagsForStencil(gn, 'operating_system_image', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'powershell_file;pointerEvents=1;', w, h, '', 'PowerShell File', null, null, this.getTagsForStencil(gn, 'powershell_file', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'queue_generic;pointerEvents=1;', w, h * 0.3, '', 'Queue Generic', null, null, this.getTagsForStencil(gn, 'queue_generic', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'rdp_remoting_file;pointerEvents=1;', w * 0.95, h, '', 'RDP Remoting File', null, null, this.getTagsForStencil(gn, 'rdp_remoting_file', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'scheduler;pointerEvents=1;', w * 0.8, h, '', 'Scheduler', null, null, this.getTagsForStencil(gn, 'scheduler', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'script_file;pointerEvents=1;', w * 0.95, h, '', 'Script File', null, null, this.getTagsForStencil(gn, 'script_file', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'server;', w, h * 0.3, '', 'Server', null, null, this.getTagsForStencil(gn, 'server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'server_rack;', w, h, '', 'Server Rack', null, null, this.getTagsForStencil(gn, 'server_rack', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'service_bus;pointerEvents=1;', w * 0.9, h, '', 'Service Bus', null, null, this.getTagsForStencil(gn, 'service_bus', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'service_bus_queues;pointerEvents=1;', w * 0.85, h, '', 'Service Bus Queues', null, null, this.getTagsForStencil(gn, 'service_bus_queues', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'service_bus_relay;pointerEvents=1;', w * 0.8, h, '', 'Service Bus Relay', null, null, this.getTagsForStencil(gn, 'service_bus_relay', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'service_bus_topics_and_subscriptions;pointerEvents=1;', w * 0.9, h, '', 'Service Bus Topics and Subscriptions', null, null, this.getTagsForStencil(gn, 'service_bus_topics_and_subscriptions', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'service_endpoint;', w, h * 0.4, '', 'Service Endpoint', null, null, this.getTagsForStencil(gn, 'service_endpoint', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'sql_database;', w * 0.75, h, '', 'SQL Database', null, null, this.getTagsForStencil(gn, 'sql_database', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'sql_database_sql_azure;', w * 0.95, h, '', 'SQL Database SQL Azure', null, null, this.getTagsForStencil(gn, 'sql_database_sql_azure', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'sql_datasync;', w * 0.75, h, '', 'SQL DataSync', null, null, this.getTagsForStencil(gn, 'sql_datasync', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'sql_reporting;', w * 0.8, h, '', 'SQL Reporting', null, null, this.getTagsForStencil(gn, 'sql_reporting', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'startup_task;pointerEvents=1;', w * 0.95, h, '', 'Startup Task', null, null, this.getTagsForStencil(gn, 'startup_task', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'storage;pointerEvents=1;', w, h * 0.8, '', 'Storage', null, null, this.getTagsForStencil(gn, 'storage', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'storage_blob;', w, h * 0.9, '', 'Storage Blob', null, null, this.getTagsForStencil(gn, 'storage_blob', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'storage_queue;', w, h * 0.9, '', 'Storage Queue', null, null, this.getTagsForStencil(gn, 'storage_queue', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'storage_table;', w, h * 0.9, '', 'Storage Table', null, null, this.getTagsForStencil(gn, 'storage_table', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'storsimple;', w, h * 0.9, '', 'StorSimple', null, null, this.getTagsForStencil(gn, 'storsimple', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'tablet;pointerEvents=1;', w, h * 0.75, '', 'Tablet', null, null, this.getTagsForStencil(gn, 'tablet', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'team_foundation_service;', w, h * 0.75, '', 'Team Foundation Service', null, null, this.getTagsForStencil(gn, 'team_foundation_service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'traffic_manager;pointerEvents=1;', w, h, '', 'Traffic Manager', null, null, this.getTagsForStencil(gn, 'traffic_manager', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'unidentified_code_object;', w, h * 0.85, '', 'Unidentified Code Object', null, null, this.getTagsForStencil(gn, 'unidentified_code_object', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'user;', w * 0.95, h, '', 'User', null, null, this.getTagsForStencil(gn, 'user', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'vhd;pointerEvents=1;', w * 0.8, h, '', 'VHD', null, null, this.getTagsForStencil(gn, 'vhd', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'vhd_data_disk;pointerEvents=1;', w * 0.75, h, '', 'VHD Data Disk', null, null, this.getTagsForStencil(gn, 'vhd_data_disk', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'virtual_machine;', w, h * 0.8, '', 'Virtual Machine', null, null, this.getTagsForStencil(gn, 'virtual_machine', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'virtual_machine_feature;pointerEvents=1;', w, h * 0.9, '', 'Virtual Machine Feature', null, null, this.getTagsForStencil(gn, 'virtual_machine_feature', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'virtual_network;pointerEvents=1;', w, h * 0.55, '', 'Virtual Network', null, null, this.getTagsForStencil(gn, 'virtual_network', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'visual_studio_online;', w, h * 0.75, '', 'Visual Studio Online', null, null, this.getTagsForStencil(gn, 'visual_studio_online', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'wadcfg_diagnostics_file;pointerEvents=1;', w * 0.95, h, '', 'WADCFG Diagnostics File', null, null, this.getTagsForStencil(gn, 'wadcfg_diagnostics_file', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'website_generic;pointerEvents=1;', w, h * 0.85, '', 'Website Generic', null, null, this.getTagsForStencil(gn, 'website_generic', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'web_role;', w, h * 0.8, '', 'Web Role', null, null, this.getTagsForStencil(gn, 'web_role', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'web_roles;', w * 1.1, h * 0.9, '', 'Web Roles', null, null, this.getTagsForStencil(gn, 'web_roles', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'worker_role;', w, h * 0.8, '', 'Worker Role', null, null, this.getTagsForStencil(gn, 'worker_role', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'worker_roles;', w * 1.1, h * 0.9, '', 'Worker Roles', null, null, this.getTagsForStencil(gn, 'worker_roles', dt).join(' '))
		]);

		this.setCurrentSearchEntryLibrary();
	};
})();
