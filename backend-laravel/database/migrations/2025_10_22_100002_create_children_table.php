<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('children', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // Identification personnelle
            $table->string('nom');
            $table->string('post_nom');
            $table->string('prenom');
            $table->string('nom_complet')->virtualAs("CONCAT(nom, ' ', post_nom, ' ', prenom)");
            $table->date('date_naissance');
            $table->enum('genre', ['Masculin', 'Féminin']);
            $table->enum('etat_civil', ['Célibataire', 'Marié(e)', 'Veuf(ve)', 'Divorcé(e)']);
            $table->text('adresse');
            $table->string('telephone');
            $table->string('email');
            $table->string('photo')->nullable();
            
            // Informations familiales
            $table->string('nom_pere');
            $table->string('nom_mere');
            $table->string('telephone_parent1');
            $table->string('telephone_parent2')->nullable();
            $table->string('email_parents');
            $table->string('contact_urgence');
            $table->string('lien_contact_urgence');
            
            // Parcours spirituel
            $table->date('date_conversion')->nullable();
            $table->date('date_bapteme')->nullable();
            $table->enum('baptise_saint_esprit', ['Oui', 'Non', 'NSP']);
            $table->enum('vie_donnee_a_jesus', ['Oui', 'Non', 'Je ne sais pas']);
            $table->boolean('est_ouvrier')->default(false);
            $table->string('commission_actuelle')->nullable();
            $table->string('commission_souhaitee')->nullable();
            $table->date('date_adhesion')->nullable();
            
            // Santé
            $table->boolean('allergies_connues')->default(false);
            $table->text('allergies_details')->nullable();
            $table->text('maladies')->nullable();
            $table->text('traitement')->nullable();
            $table->boolean('autorisation_soins')->default(false);
            
            // Évaluation
            $table->enum('vie_chretienne', ['Très bonne', 'Bonne', 'Moyenne', 'Faible', 'Très mauvaise'])->nullable();
            $table->enum('vie_priere', ['Excellente', 'Bonne', 'Moyenne', 'Faible', 'Très faible'])->nullable();
            $table->enum('comprehension_bible', ['Excellente', 'Bonne', 'Moyenne', 'Faible', 'Très faible'])->nullable();
            $table->enum('gagne_une_ame', ['Oui', 'Non', 'Je ne sais pas'])->default('Je ne sais pas');
            $table->enum('encadreur', ['Oui', 'Non', 'NSP'])->default('NSP');
            $table->enum('qualite_enseignements', ['Bonne', 'Moyenne', 'Faible'])->nullable();
            $table->text('sujet_souhaite')->nullable();
            $table->text('besoin_suggestion')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('email');
            $table->index('telephone');
            // Index composite avec longueur limitée pour MySQL utf8mb4
            // $table->index(['nom', 'prenom']); // Removed to avoid index length error
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('children');
    }
};
