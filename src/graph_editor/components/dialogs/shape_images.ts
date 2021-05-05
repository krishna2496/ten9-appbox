/*
 * ten9, Inc
 * Copyright (c) 2015 - 2021 ten9, Inc
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
const sidebarFlowchartImage = require('~images/sidebar-flowchart.png');
const sidebarActiveDirectoryImage = require('~images/sidebar-active_directory.png');
const sidebarAndroidImage = require('~images/sidebar-android.png');
const sidebarBootstrapImage = require('~images/sidebar-bootstrap.png');
const sidebarC4Image = require('~images/sidebar-c4.png');
const sidebarAtlassianImage = require('~images/sidebar-atlassian.png');
const sidebarDfdImage = require('~images/sidebar-dfd.png');
const sidebarErImage = require('~images/sidebar-er.png');
const sidebarIosImage = require('~images/sidebar-ios.png');
const sidebarMockupsImage = require('~images/sidebar-mockups.png');
const sidebarSitemapImage = require('~images/sidebar-sitemap.png');
const sidebarUmlImage = require('~images/sidebar-uml.png');
const sidebarAlliedTelesisImage = require('~images/sidebar-allied_telesis.png');
const sidebarAws3Image = require('~images/sidebar-aws3.png');
const sidebarAws4bImage = require('~images/sidebar-aws4b.png');
const sidebarAws4Image = require('~images/sidebar-aws4.png');
const sidebarAws3dImage = require('~images/sidebar-aws3d.png');
const sidebarAzureImage = require('~images/sidebar-azure.png');
const sidebarMscaeImage = require('~images/sidebar-mscae.png');
const sidebarCiscoImage = require('~images/sidebar-cisco.png');
const sidebarCisco19Image = require('~images/sidebar-cisco19.png');
const sidebarCiscosafeImage = require('~images/sidebar-cisco_safe.png');
const sidebarCumulusImage = require('~images/sidebar-cumulus.png');
const sidebarCitrixImage = require('~images/sidebar-citrix.png');
const sidebarGcp2Image = require('~images/sidebar-gcp2.png');
const sidebarIbmImage = require('~images/sidebar-ibm.png');
const sidebarKubernetesImage = require('~images/sidebar-kubernetes.png');
const sidebarNetworkImage = require('~images/sidebar-network.png');
const sidebarOfficeImage = require('~images/sidebar-office.png');
const sidebarRackImage = require('~images/sidebar-rack.png');
const sidebarVeeamImage = require('~images/sidebar-veeam.png');
const sidebarVvdImage = require('~images/sidebar-vvd.png');
const sidebarArchimate3Image = require('~images/sidebar-archimate3.png');
const sidebarBpmnImage = require('~images/sidebar-bpmn.png');
const sidebarArchimateImage = require('~images/sidebar-archimate.png');
const sidebarSysmlImage = require('~images/sidebar-sysml.png');
const sidebarLeanMappingImage = require('~images/sidebar-leanmapping.png');
const sidebarCabinetsImage = require('~images/sidebar-cabinets.png');
const sidebarInfographicImage = require('~images/sidebar-infographic.png');
const sidebarEipImage = require('~images/sidebar-eip.png');
const sidebarElectricalImage = require('~images/sidebar-electrical.png');
const sidebarFloorPlansImage = require('~images/sidebar-floorplans.png');
const sidebarFluidPowerImage = require('~images/sidebar-fluid_power.png');
const sidebarGmdlImage = require('~images/sidebar-gmdl.png');
const sidebarPidImage = require('~images/sidebar-pid.png');
const sidebarThreatModelingImage = require('~images/sidebar-threatmodeling.png');
const sidebarWebIconsImage = require('~images/sidebar-webIcons.png');
const sidebarSignsImage = require('~images/sidebar-signs.png');

/* eslint-disable camelcase */

const images = {
  general: sidebarGeneralImage,
  basic: sidebarBasicImage,
  arrows2: sidebarArrows2Image,
  clipart: sidebarClipartImage,
  flowchart: sidebarFlowchartImage,
  active_directory: sidebarActiveDirectoryImage,
  android: sidebarAndroidImage,
  atlassian: sidebarAtlassianImage,
  bootstrap: sidebarBootstrapImage,
  c4: sidebarC4Image,
  dfd: sidebarDfdImage,
  er: sidebarErImage,
  ios: sidebarIosImage,
  mockups: sidebarMockupsImage,
  sitemap: sidebarSitemapImage,
  uml: sidebarUmlImage,
  allied_telesis: sidebarAlliedTelesisImage,
  aws3: sidebarAws3Image,
  aws4b: sidebarAws4bImage,
  aws4: sidebarAws4Image,
  aws3d: sidebarAws3dImage,
  azure2: sidebarAzureImage,
  mscae: sidebarMscaeImage,
  cisco: sidebarCiscoImage,
  cisco19: sidebarCisco19Image,
  cisco_safe: sidebarCiscosafeImage,
  cumulus: sidebarCumulusImage,
  citrix: sidebarCitrixImage,
  gcp2: sidebarGcp2Image,
  ibm: sidebarIbmImage,
  kubernetes: sidebarKubernetesImage,
  network: sidebarNetworkImage,
  office: sidebarOfficeImage,
  rack: sidebarRackImage,
  veeam2: sidebarVeeamImage,
  vvd: sidebarVvdImage,
  archimate3: sidebarArchimate3Image,
  archimate: sidebarArchimateImage,
  bpmn: sidebarBpmnImage,
  sysml: sidebarSysmlImage,
  lean_mapping: sidebarLeanMappingImage,
  cabinets: sidebarCabinetsImage,
  infographic: sidebarInfographicImage,
  eip: sidebarEipImage,
  electrical: sidebarElectricalImage,
  floorplan: sidebarFloorPlansImage,
  fluid_power: sidebarFluidPowerImage,
  gmdl: sidebarGmdlImage,
  pid: sidebarPidImage,
  threatModeling: sidebarThreatModelingImage,
  webicons: sidebarWebIconsImage,
  signs: sidebarSignsImage,
};

export function getImage(id: string) {
  return images[id];
}
