/**
 * Services API centralisés
 * Tous les services pour communiquer avec le backend Laravel
 */

import { monitorsService } from './monitors.service';
import { childrenService } from './children.service';
import { sallesService } from './salles.service';
import { activitiesService } from './activities.service';
import { blogsService } from './blogs.service';
import { videosService } from './videos.service';
import { photosService } from './photos.service';
import { teachingsService } from './teachings.service';
import { worshipReportsService } from './worship-reports.service';
import { expensesService } from './expenses.service';
import { paymentsService } from './payments.service';
import { presencesService } from './presences.service';
import { cotisationsService } from './cotisations.service';
import { sortiesService } from './sorties.service';
import { rolesService } from './roles.service';

// Exports nommés
export {
  monitorsService,
  childrenService,
  sallesService,
  activitiesService,
  blogsService,
  videosService,
  photosService,
  teachingsService,
  worshipReportsService,
  expensesService,
  paymentsService,
  presencesService,
  cotisationsService,
  sortiesService,
  rolesService,
};

// Export groupé pratique
export const apiServices = {
  monitorsService,
  childrenService,
  sallesService,
  activitiesService,
  blogsService,
  videosService,
  photosService,
  teachingsService,
  worshipReportsService,
  expensesService,
  paymentsService,
  presencesService,
  cotisationsService,
  sortiesService,
};
