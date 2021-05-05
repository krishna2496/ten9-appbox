/*
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

const sidebarGeneralImage = require('~images/sidebar-general.png');
const sidebarBasicImage = require('~images/sidebar-basic.png');
const sidebarArrows2Image = require('~images/sidebar-arrows2.png');
const sidebarClipartImage = require('~images/sidebar-clipart.png');
const sidebarflowchartImage = require('~images/sidebar-flowchart.png');
const sidebaractivedirectoryImage = require('~images/sidebar-active_directory.png');
const sidebarandroidImage = require('~images/sidebar-android.png');
const sidebarbootstrapImage = require('~images/sidebar-bootstrap.png');
const sidebarc4Image = require('~images/sidebar-c4.png');
const sidebaratlassianImage = require('~images/sidebar-atlassian.png');
const sidebardfdImage = require('~images/sidebar-dfd.png');
const sidebarerImage = require('~images/sidebar-er.png');
const sidebariosImage = require('~images/sidebar-ios.png');
const sidebarmockupsImage = require('~images/sidebar-mockups.png');
const sidebarsitemapImage = require('~images/sidebar-sitemap.png');
const sidebarumlImage = require('~images/sidebar-uml.png');
const sidebaralliedtelesisImage = require('~images/sidebar-allied_telesis.png');
const sidebaraws3Image = require('~images/sidebar-aws3.png');
const sidebaraws4bImage = require('~images/sidebar-aws4b.png');
const sidebaraws4Image = require('~images/sidebar-aws4.png');
const sidebaraws3dImage = require('~images/sidebar-aws3d.png');
const sidebarazureImage = require('~images/sidebar-azure.png');
const sidebarmscaeImage = require('~images/sidebar-mscae.png');
const sidebarciscoImage = require('~images/sidebar-cisco.png');
const sidebarcisco19Image = require('~images/sidebar-cisco19.png');
const sidebarciscosafeImage = require('~images/sidebar-cisco_safe.png');
const sidebarcumulusImage = require('~images/sidebar-cumulus.png');
const sidebarcitrixImage = require('~images/sidebar-citrix.png');
const sidebargcp2Image = require('~images/sidebar-gcp2.png');
const sidebaribmImage = require('~images/sidebar-ibm.png');
const sidebarkubernetesImage = require('~images/sidebar-kubernetes.png');
const sidebarnetworkImage = require('~images/sidebar-network.png');
const sidebarofficeImage = require('~images/sidebar-office.png');
const sidebarrackImage = require('~images/sidebar-rack.png');
const sidebarveeamImage = require('~images/sidebar-veeam.png');
const sidebarvvdImage = require('~images/sidebar-vvd.png');
const sidebararchimate3Image = require('~images/sidebar-archimate3.png');
const sidebarbpmnImage = require('~images/sidebar-bpmn.png');
const sidebararchimateImage = require('~images/sidebar-archimate.png');
const sidebarsysmlImage = require('~images/sidebar-sysml.png');
const sidebarleanmappingImage = require('~images/sidebar-leanmapping.png');
const sidebarcabinetsImage = require('~images/sidebar-cabinets.png');
const sidebarinfographicImage = require('~images/sidebar-infographic.png');
const sidebareipImage = require('~images/sidebar-eip.png');
const sidebarelectricalImage = require('~images/sidebar-electrical.png');
const sidebarfloorplansImage = require('~images/sidebar-floorplans.png');
const sidebarfluidpowerImage = require('~images/sidebar-fluid_power.png');
const sidebargmdlImage = require('~images/sidebar-gmdl.png');
const sidebarpidImage = require('~images/sidebar-pid.png');
const sidebarthreatmodelingImage = require('~images/sidebar-threatmodeling.png');
const sidebarwebIconsImage = require('~images/sidebar-webIcons.png');
const sidebarsignsImage = require('~images/sidebar-signs.png');

const images = [
  { name: 'general', file: sidebarGeneralImage },
  { name: 'basic', file: sidebarBasicImage },
  { name: 'arrows2', file: sidebarArrows2Image },
  { name: 'clipart', file: sidebarClipartImage },
  { name: 'flowchart', file: sidebarflowchartImage },
  { name: 'active_directory', file: sidebaractivedirectoryImage },
  { name: 'android', file: sidebarandroidImage },
  { name: 'atlassian', file: sidebaratlassianImage },
  { name: 'bootstrap', file: sidebarbootstrapImage },
  { name: 'c4', file: sidebarc4Image },
  { name: 'dfd', file: sidebardfdImage },
  { name: 'er', file: sidebarerImage },
  { name: 'ios', file: sidebariosImage },
  { name: 'mockups', file: sidebarmockupsImage },
  { name: 'sitemap', file: sidebarsitemapImage },
  { name: 'uml', file: sidebarumlImage },
  { name: 'allied_telesis', file: sidebaralliedtelesisImage },
  { name: 'aws3', file: sidebaraws3Image },
  { name: 'aws4b', file: sidebaraws4bImage },
  { name: 'aws4', file: sidebaraws4Image },
  { name: 'aws3d', file: sidebaraws3dImage },
  { name: 'azure2', file: sidebarazureImage },
  { name: 'mscae', file: sidebarmscaeImage },
  { name: 'cisco', file: sidebarciscoImage },
  { name: 'cisco19', file: sidebarcisco19Image },
  { name: 'cisco_safe', file: sidebarciscosafeImage },
  { name: 'cumulus', file: sidebarcumulusImage },
  { name: 'citrix', file: sidebarcitrixImage },
  { name: 'gcp2', file: sidebargcp2Image },
  { name: 'ibm', file: sidebaribmImage },
  { name: 'kubernetes', file: sidebarkubernetesImage },
  { name: 'network', file: sidebarnetworkImage },
  { name: 'office', file: sidebarofficeImage },
  { name: 'rack', file: sidebarrackImage },
  { name: 'veeam2', file: sidebarveeamImage },
  { name: 'vvd', file: sidebarvvdImage },
  { name: 'archimate3', file: sidebararchimate3Image },
  { name: 'archimate', file: sidebararchimateImage },
  { name: 'bpmn', file: sidebarbpmnImage },
  { name: 'sysml', file: sidebarsysmlImage },
  { name: 'lean_mapping', file: sidebarleanmappingImage },
  { name: 'cabinets', file: sidebarcabinetsImage },
  { name: 'infographic', file: sidebarinfographicImage },
  { name: 'eip', file: sidebareipImage },
  { name: 'electrical', file: sidebarelectricalImage },
  { name: 'floorplan', file: sidebarfloorplansImage },
  { name: 'fluid_power', file: sidebarfluidpowerImage },
  { name: 'gmdl', file: sidebargmdlImage },
  { name: 'pid', file: sidebarpidImage },
  { name: 'threatModeling', file: sidebarthreatmodelingImage },
  { name: 'webicons', file: sidebarwebIconsImage },
  { name: 'signs', file: sidebarsignsImage },
];

function getImage(id) {
  const shape = images.filter((image) => image.name == id);
  return shape[0].file;
}

module.exports = {
  getImage,
};
