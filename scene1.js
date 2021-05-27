var map = [];
var map_aux = [];

var graphics;
var scoreText;
var reserveText;
var reserveText2;
var scoreFinalText;

var cursors;

var timing = 0;
var timing2 = 0;

var pause = true;
var pause_possible = false;

var color = 1;
var switch_color_possible = false;
var size_radius = 1;
var reserve_mouse = 180;
var reserve_mouse2 = 5;

var mouse_possible = false;
var radius_up_possible = false;
var radius_down_possible = false;
var mode_dessin = 0;
var switch_mode_dessin_possible = false;

var compteur_cases_non_vides;

var scoreMax = 0;
var nb_tour_var_max_max = 100;
var nb_tour_var_max;

var palette_couleur;

/************** PARAMETRES MODIFIABLES **************/

const num_l = 60;
const num_c = 60;
const size_l = 12;
const size_c = 12;

const lim_display_grid = 13;
const angle_display = 4;

const mode_score = false;
const random_start = false;

class scene1 extends Phaser.Scene{
    
    constructor ()
    {
        super("scene1");
        this.pad = null;
    }
    
    preload ()
    {   
    }
    
    create ()
    {
        graphics = this.add.graphics();
        
        //this.physics.world.setBounds(-num_l*angle_display, 0,config.width,config.height);
        //this.cameras.main.setPosition(-num_l*angle_display + 0.1*(num_c * (size_c+angle_display) + num_l * angle_display),0.1*num_l * size_l,config.width,config.height);
        this.cameras.main.setScroll(-num_l*(angle_display+1)-0.02*(num_c * (size_c+angle_display) + num_l * (angle_display+1)),-70);
        
        if (mode_score)
        {
            scoreText = this.add.text(16, 16,"", {
                fontSize: '18px',
                padding: { x: 10, y: 5 },
                fill: '#ffffff'
            }).setScrollFactor(0);

            reserveText= this.add.text(config.width - 330, config.height - 66,"reserve longueur clic = "+reserve_mouse, {
                fontSize: '18px',
                padding: { x: 10, y: 5 },
                fill: '#ffffff'
            }).setScrollFactor(0);

            reserveText2= this.add.text(config.width - 330, config.height - 36,"reserve nombre clic = "+reserve_mouse2, {
                fontSize: '18px',
                padding: { x: 10, y: 5 },
                fill: '#ffffff'
            }).setScrollFactor(0);
        }
        
        cursors = this.input.keyboard.addKeys({ 'pause': Phaser.Input.Keyboard.KeyCodes.SPACE, 'switch_color': Phaser.Input.Keyboard.KeyCodes.C, 'radius_up': Phaser.Input.Keyboard.KeyCodes.P, 'radius_down': Phaser.Input.Keyboard.KeyCodes.M, 'switch_mode_dessin': Phaser.Input.Keyboard.KeyCodes.B, 'trait_droit': Phaser.Input.Keyboard.KeyCodes.ALT});
        
        palette_couleur = [[0xf2e2e2,0xf2e2e2,0xf2e2e2],[0xff00ff,0xcf22cf,0xcf33cf],[0xcf00ff,0x9f22cf,0x9f33cf],[0xaf00ff,0x7f22cf,0x7f33cf],[0x8f00ff,0x5f22cf,0x5f33cf],[0x00ff00,0x00ff00,0x00ff00],[0x30ff30,0x30ff30,0x30ff30],[0x60ff60,0x60ff60,0x60ff60],[0x90ff90,0x90ff90,0x90ff90],[0x90ff90,0x90ff90,0x90ff90],];
        
        for (let i = 0; i < num_l; i++)
        {
            map.push([]);
            map_aux.push([]);
            for (let j = 0; j < num_c; j++)
            {
                map[i].push(0);
                map_aux[i].push(0);
            }
        }
        
        if (random_start)
        {
            var nb_trait = 9+Math.floor(5*Math.random());
            for (let n = 0; n < nb_trait; n++)
            {
                var x_start = Math.floor(config.width*Math.random());
                var y_start = Math.floor(config.height*Math.random());
                var theta = 2*Math.PI*Math.random();
                var length_trait = 3+Math.floor(28*Math.random());
                for (let p = 0; p < length_trait; p++)
                {
                    var i = Math.floor(y_start/size_l);
                    var j = Math.floor(x_start/size_c);
                    for (let k = -size_radius; k <= size_radius; k++)
                    {
                        for (let l = -size_radius; l <= size_radius; l++)
                        {
                            if (Math.pow(Math.pow(k,2)+Math.pow(l,2),0.5) <= size_radius && 0<=i+k && i+k<num_l && 0<=j+l && j+l<num_c)
                            {
                                map[i+k][j+l] = color;
                                map_aux[i+k][j+l]  = color;
                                //draw(color,(j+l)*(size_c+angle_display)-angle_display*i,(i+k)*size_l,(size_c+angle_display),size_l);
                            }
                        }
                    }
                    var d = 2+Math.floor((6*size_radius+1)*Math.random());
                    x_start += d*Math.cos(theta);
                    y_start += d*Math.sin(theta);
                    theta += 2*Math.PI/8*Math.random()-Math.PI/8;
                    if(p%3==0){size_radius = Math.min(Math.max(size_radius + Math.floor(3*Math.random())-1,0),4);}
                }
            }
        }
        
        for (let i = 0; i < num_l; i++)
        {
            for (let j = 0; j < num_c; j++)
            {
                map_aux[i][j] = map[i][j];
                draw(map[i][j],i,j);//j*(size_c+angle_display)-angle_display*i,i*size_l,(size_c+angle_display),size_l);
            }
        }
        size_radius = 1;
    }
    
    update ()
    {
        if (cursors.pause.isUp && pause_possible)
        {
            if (pause){pause = false;}
            else{pause = true;}
            pause_possible = false;
        }
        if (cursors.pause.isDown){pause_possible = true;}
        
        if (cursors.switch_color.isUp && switch_color_possible)
        {
            if (color == 1){color = 0;}
            else{color = 1;}
            switch_color_possible = false;
        }
        if (cursors.switch_color.isDown){switch_color_possible = true;}
        
        if (cursors.switch_mode_dessin.isUp && switch_mode_dessin_possible)
        {
            if (mode_dessin == 0){mode_dessin = 1;}
            else{mode_dessin = 0;}
            switch_mode_dessin_possible = false;
        }
        if (cursors.switch_mode_dessin.isDown){switch_mode_dessin_possible = true;}
        
        if (cursors.radius_up.isUp && radius_up_possible && !mode_score)
        {
            size_radius++;
            radius_up_possible = false;
        }
        if (cursors.radius_up.isDown){radius_up_possible = true;}
        
        if (cursors.radius_down.isUp && radius_down_possible)
        {
            if (size_radius!=0){size_radius--;}
            radius_down_possible = false;
        }
        if (cursors.radius_down.isDown){radius_down_possible = true;}
        
        if (this.input.activePointer.isDown && 0<game.input.mousePointer.y<config.height && 0<game.input.mousePointer.x<config.width && ((reserve_mouse>0 && reserve_mouse2>0) || !mode_score))
        {
            var i = Math.floor((game.input.mousePointer.y-70)/size_l);
            var j = Math.floor((game.input.mousePointer.x-num_l*(angle_display+1)-0.02*(num_c * (size_c+angle_display) + num_l * (angle_display+1))+angle_display*i)/(size_c+angle_display));;
            for (let k = -size_radius; k <= size_radius; k++)
            {
                for (let l = -size_radius; l <= size_radius; l++)
                {
                    if (Math.pow(Math.pow(k,2)+Math.pow(l,2),0.5) <= size_radius && 0<=i+k && i+k<num_l && 0<=j+l && j+l<num_c)
                    {
                        if (map[i+k][j+l] == 0 || timing2%15 == 0)
                        {
                            if (mode_dessin == 0)
                            {
                                if (color == 1)
                                {
                                    map[i+k][j+l] = Math.min(map[i+k][j+l] + color,4);
                                    map_aux[i+k][j+l]  += Math.min(map_aux[i+k][j+l] + color,4);
                                    draw(map[i+k][j+l],i+k,j+l);
                                }
                                else
                                {
                                    map[i+k][j+l] = Math.max(map[i+k][j+l] - color,0);
                                    map_aux[i+k][j+l]  = Math.max(map_aux[i+k][j+l] - color,0);
                                    draw(map[i+k][j+l],i+k,j+l);
                                }
                            }
                            else
                            {
                                {
                                    map[i+k][j+l] = color;
                                    map_aux[i+k][j+l]  = color;
                                    draw(map[i+k][j+l],i+k,j+l);
                                }
                            }
                        }
                    }
                }
            }
            if(mode_score)
            {
                reserve_mouse--;
                reserveText.setText("reserve longueur clic = "+reserve_mouse);
                mouse_possible =true;
            }
        }
        
        if (mouse_possible && !this.input.activePointer.isDown)
        {
            if (mode_score)
            {
                reserve_mouse2--;
                reserveText2.setText("reserve nombre clic = "+reserve_mouse2);
                mouse_possible = false;
            }
        }
        
        if (!pause)
        {
            if (timing == 0)
            {
                for (let i = 0; i < num_l; i++)
                {
                    for (let j = 0; j < num_c; j++)
                    {
                        /*
                        var compteur = 0;
                        for (let k = -1; k < 2; k++)
                        {
                            for (let l = -1; l < 2; l++)
                            {
                                var dep_ik = i+k;
                                var dep_jl = j+l;
                                if (dep_ik > num_l-1){dep_ik = 0}
                                else if (dep_ik < 0){dep_ik = num_l-1}
                                if (dep_jl > num_c-1){dep_jl = 0}
                                else if (dep_jl < 0){dep_jl = num_c-1}
                                if ((k!=0 || l!=0) && map[dep_ik][dep_jl] == 1)
                                {
                                    compteur += 1;
                                }
                            }
                        }
                        if (compteur == 3)
                        {
                            map_aux[i][j] = 1;
                            if (map[i][j] == 0)
                            {
                                graphics.fillStyle(0xff00ff, 1);
                                if (size_c < lim_display_grid){graphics.fillRect(j*size_c,i*size_l,size_c,size_l);}
                                else {graphics.fillRect(j*size_c+1,i*size_l+1,size_c-2,size_l-2);}
                            }
                        }
                        else if (compteur > 3 || compteur < 2)
                        {
                            map_aux[i][j] = 0;
                            if (map[i][j] == 1)
                            {
                                graphics.fillStyle(0xffff00, 1);
                                if (size_c < lim_display_grid){graphics.fillRect(j*size_c,i*size_l,size_c,size_l);}
                                else {graphics.fillRect(j*size_c+1,i*size_l+1,size_c-2,size_l-2);}
                            }
                        }*/
                        
                        //Comptage des voisins
                        var compteur1 = 0;
                        var compteur2 = 0;
                        var compteur3 = 0;
                        var compteur4 = 0;
                        var compteur5 = 0;
                        for (let k = -1; k < 2; k++)
                        {
                            for (let l = -1; l < 2; l++)
                            {
                                var dep_ik = i+k;
                                var dep_jl = j+l;
                                if (dep_ik > num_l-1){dep_ik = 0}
                                else if (dep_ik < 0){dep_ik = num_l-1}
                                if (dep_jl > num_c-1){dep_jl = 0}
                                else if (dep_jl < 0){dep_jl = num_c-1}
                                if (k!=0 || l!=0)
                                {
                                    if (map[dep_ik][dep_jl] == 1){compteur1 += 1;}
                                    else if (map[dep_ik][dep_jl] == 2){compteur2 += 1;}
                                    else if (map[dep_ik][dep_jl] == 3){compteur3 += 1;}
                                    else if (map[dep_ik][dep_jl] == 4){compteur4 += 1;}
                                    else if (map[dep_ik][dep_jl] >= 5){compteur5 += 1;}
                                }
                            }
                        }
                        
                        //Regles d'evolution
                        if (map[i][j] == 0)
                        {
                            if (compteur1 == 3 || compteur1+compteur2+compteur3 > 6)
                            {
                                map_aux[i][j] += 1;
                            }
                        }
                        else if (map[i][j] == 1)
                        {
                            
                            if (compteur5 > 0)
                            {
                                map_aux[i][j] += 3;
                            }
                            else if (compteur1 > 5)
                            {
                                map_aux[i][j] += 1;
                            }
                            else if (compteur1 < 2)
                            {
                                map_aux[i][j] -= 1;
                            }
                        }
                        else if (map[i][j] == 2)
                        {
                            if (compteur5 > 0)
                            {
                                map_aux[i][j] += 2;
                            }
                            else if (compteur1+compteur2 > 6)
                            {
                                map_aux[i][j] += 1;
                            }
                            else if (compteur1+compteur2 < 2)
                            {
                                map_aux[i][j] -= 1;
                            }
                        }
                        else if (map[i][j] == 3)
                        {
                            if (compteur5 > 0)
                            {
                                map_aux[i][j] += 1;
                            }
                            else if (compteur1+compteur2+compteur3 > 7)
                            {
                                map_aux[i][j] += 1;
                            }
                            else if (compteur1+compteur2+compteur3 < 3)
                            {
                                map_aux[i][j] -= 1;
                            }
                        }
                        else if (map[i][j] == 4)
                        {
                            if (compteur4 > 1)
                            {
                                map_aux[i][j] = 5;
                            }
                            else if (compteur3+compteur2 < 3)
                            {
                                map_aux[i][j] -= 1;
                            }
                        }
                        else if ( 5 <= map[i][j] && map[i][j] < 8)
                        {
                            map_aux[i][j] += 1;
                        }
                        else if (map[i][j] == 8)
                        {
                            map_aux[i][j] = 0;
                        }
                        
                        //Affichage si changement
                        //if (map[i][j] != map_aux[i][j]){draw(map_aux[i][j],j*(size_c+angle_display),i*size_l,(size_c+angle_display),size_l);}
                        draw(map_aux[i][j],i,j);
                        
                    }
                }

                compteur_cases_non_vides = 0;
                for (let i = 0; i < num_l; i++)
                {
                    for (let j = 0; j < num_c; j++)
                    {
                        if(map_aux[i][j]!=0){compteur_cases_non_vides++}
                        map[i][j] = map_aux[i][j];
                    }
                }
                if (mode_score)
                {
                    if(scoreMax<compteur_cases_non_vides)
                    {
                        scoreMax = compteur_cases_non_vides;
                        nb_tour_var_max = nb_tour_var_max_max;
                    }
                    else
                    {
                        nb_tour_var_max--;
                    }                
                    if(nb_tour_var_max<=0)
                    {
                        pause=true;
                        scoreText.setVisible(false);
                        scoreFinalText = this.add.text(config.width/2-650, config.height/2-80,"Score max = "+scoreMax, {
                            fontSize: '120px',
                            padding: { x: 10, y: 5 },
                            fill: '#000000'
                        });
                    }
                }
                if (mode_score)
                {
                    scoreText.setFontSize(18+Math.floor(compteur_cases_non_vides/30));
                    scoreText.setText(compteur_cases_non_vides);
                }
            }
            timing = (timing+1)%5;
            clean();
        }
        timing2 = (timing2+1)%1000;
    }
}

function clean()
{
    var poly = new Phaser.Geom.Polygon();

    poly.setTo([ new Phaser.Geom.Point(0, 0), new Phaser.Geom.Point(config.width, 0), new Phaser.Geom.Point(config.width, 0), new Phaser.Geom.Point(0, 0) ]);
    graphics.fillStyle(0x000000, 1);
    graphics.fillPoints(poly.points, true);
}

function draw(color,i,j)
{
    var x = j*(size_c+angle_display)-(angle_display+1)*i;//+angle_display*(num_l-i);
    var y = i*size_l;
    var lx = size_c;
    var ly = size_l;
    var hauteur;
    var ind_color;
    if (color == 0)     {ind_color = 0; hauteur = 0;}
    else if (color == 1){ind_color = 1; hauteur = 5;}
    else if (color == 2){ind_color = 2; hauteur = 10;}
    else if (color == 3){ind_color = 3; hauteur = 15;}
    else if (color == 4){ind_color = 4; hauteur = 20;}
    else if (color == 5){ind_color = 5; hauteur = 0;}
    else if (color == 6){ind_color = 6; hauteur = -4;}
    else if (color == 7){ind_color = 7; hauteur =-8;}
    else if (color >= 8){ind_color = 8; hauteur =-12;}
    else                {ind_color = 8; hauteur =-16;}
    
    y -= hauteur;
    
    if (size_c < lim_display_grid)
    {
        graphics.lineStyle(5, 0xFF0FFF, 1.0);
        var poly = new Phaser.Geom.Polygon();
        
        poly.setTo([ new Phaser.Geom.Point(x, y), new Phaser.Geom.Point(x+lx+angle_display, y), new Phaser.Geom.Point(x+lx, y+ly), new Phaser.Geom.Point(x-angle_display, y+ly) ]);
        graphics.fillStyle(palette_couleur[ind_color][0], 1);
        graphics.fillPoints(poly.points, true);
        
        poly.setTo([ new Phaser.Geom.Point(x-angle_display, y+ly), new Phaser.Geom.Point(x+lx, y+ly), new Phaser.Geom.Point(x+lx, y+ly+hauteur), new Phaser.Geom.Point(x-angle_display, y+ly+hauteur) ]);
        graphics.fillStyle(palette_couleur[ind_color][1], 1);
        graphics.fillPoints(poly.points, true);
        
        poly.setTo([ new Phaser.Geom.Point(x+lx, y+ly), new Phaser.Geom.Point(x+lx+angle_display, y), new Phaser.Geom.Point(x+lx+angle_display, y+hauteur), new Phaser.Geom.Point(x+lx, y+ly+hauteur) ]);
        graphics.fillStyle(palette_couleur[ind_color][2], 1);
        graphics.fillPoints(poly.points, true);
        /*
        graphics.fillRect(x,y-hauteur,lx,ly);
        if (angle_display>0)
        {
            graphics.fillTriangle(x+lx,y-hauteur,x+lx+angle_display,y-hauteur,x+lx,y+ly-hauteur);
            graphics.fillTriangle(x,y-hauteur,x,y+ly-hauteur,x-angle_display,y+ly-hauteur);
        }*/
    }
    else
    {
        graphics.lineStyle(5, 0xFF0FFF, 1.0);
        var poly = new Phaser.Geom.Polygon();
        
        poly.setTo([ new Phaser.Geom.Point(x+1, y+1), new Phaser.Geom.Point(x+lx+angle_display-1, y+1), new Phaser.Geom.Point(x+lx-1, y+ly-1), new Phaser.Geom.Point(x-angle_display+1, y+ly-1) ]);
        graphics.fillStyle(palette_couleur[ind_color][0], 1);
        graphics.fillPoints(poly.points, true);
        
        poly.setTo([ new Phaser.Geom.Point(x-angle_display+1, y+ly-1), new Phaser.Geom.Point(x+lx-1, y+ly-1), new Phaser.Geom.Point(x+lx-1, y+ly-1+hauteur), new Phaser.Geom.Point(x-angle_display+1, y+ly-1+hauteur) ]);
        graphics.fillStyle(palette_couleur[ind_color][1], 1);
        graphics.fillPoints(poly.points, true);
        
        poly.setTo([ new Phaser.Geom.Point(x+lx-1, y+ly-1), new Phaser.Geom.Point(x+lx+angle_display-1, y+1), new Phaser.Geom.Point(x+lx+angle_display-1, y+1+hauteur), new Phaser.Geom.Point(x+lx-1, y+ly-1+hauteur) ]);
        graphics.fillStyle(palette_couleur[ind_color][2], 1);
        graphics.fillPoints(poly.points, true);
    }
}