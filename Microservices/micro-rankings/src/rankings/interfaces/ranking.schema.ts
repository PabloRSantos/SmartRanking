import {
  Prop,
  Schema as SchemaDecorator,
  SchemaFactory,
} from '@nestjs/mongoose';
import { Document, Schema } from 'mongoose';

@SchemaDecorator({ timestamps: true, collection: 'Rankings' })
export class Ranking extends Document {
  @Prop({ type: Schema.Types.ObjectId })
  challenge: string;

  @Prop({ type: Schema.Types.ObjectId })
  player: string;

  @Prop({ type: Schema.Types.ObjectId })
  game: string;

  @Prop({ type: Schema.Types.ObjectId })
  category: string;

  @Prop()
  event: string;

  @Prop()
  operation: string;

  @Prop()
  points: number;
}

export const RankingSchema = SchemaFactory.createForClass(Ranking);
